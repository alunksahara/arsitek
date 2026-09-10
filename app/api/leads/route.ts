import {
  enforceLeadRateLimit,
  verifyTurnstile,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";
import { createAdminSupabase } from "@/lib/supabase-admin";

const VALID_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

type LeadStatus = (typeof VALID_STATUSES)[number];

function cleanString(
  value: unknown,
  maxLength = 1000
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function escapeIlike(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/,/g, "");
}

function isValidStatus(
  value: string
): value is LeadStatus {
  return VALID_STATUSES.includes(
    value as LeadStatus
  );
}

function getServerSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase server environment belum lengkap."
    );
  }

  return createAdminSupabase();
}

/* ======================================================
   AUDIT LOG
====================================================== */

async function writeLeadAuditLog({
  supabase,
  user,
  leadId,
  action,
  oldValues,
  newValues,
}: {
  supabase: ReturnType<
    typeof createAdminSupabase
  >;
  user: {
    id: string;
    email?: string | null;
  };
  leadId: string;
  action: string;
  oldValues: Record<string, unknown>;
  newValues: Record<string, unknown>;
}) {
  try {
    const { error } =
      await supabase
        .from("audit_logs")
        .insert({
          actor_id: user.id,
          action,
          entity_type: "lead",
          entity_id: leadId,
          details: {
            old_values: oldValues,
            new_values: newValues,
          },
        });

    if (error) {
      console.error(
        "[LEAD AUDIT ERROR]",
        error
      );
    } else {
      console.log(
        "[LEAD AUDIT SUCCESS]",
        {
          action,
          leadId,
        }
      );
    }
  } catch (error) {
    console.error(
      "[LEAD AUDIT EXCEPTION]",
      error
    );
  }
}

/* ======================================================
   GET /api/leads
====================================================== */

export async function GET(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (
      !admin.authorized ||
      !admin.user
    ) {
      return jsonError(
        "Unauthorized",
        401
      );
    }

    const supabase =
      getServerSupabase();

    const url =
      new URL(request.url);

    const page = Math.max(
      1,
      Number(
        url.searchParams.get("page")
      ) || 1
    );

    const pageSize = Math.min(
      50,
      Math.max(
        5,
        Number(
          url.searchParams.get(
            "pageSize"
          )
        ) || 10
      )
    );

    const q = cleanString(
      url.searchParams.get("q"),
      200
    );

    const status = cleanString(
      url.searchParams.get("status"),
      50
    );

    const from =
      (page - 1) * pageSize;

    const to =
      from + pageSize - 1;

    let query = supabase
      .from("leads")
      .select("*", {
        count: "exact",
      })
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (q) {
      const search =
        escapeIlike(q);

      query = query.or(
        [
          `name.ilike.%${search}%`,
          `email.ilike.%${search}%`,
          `phone.ilike.%${search}%`,
          `message.ilike.%${search}%`,
        ].join(",")
      );
    }

    if (
      status &&
      status !== "all"
    ) {
      if (!isValidStatus(status)) {
        return jsonError(
          "Status tidak valid.",
          400
        );
      }

      query = query.eq(
        "status",
        status
      );
    }

    const {
      data,
      error,
      count,
    } = await query;

    if (error) {
      console.error(
        "[LEADS GET ERROR]",
        error
      );

      return jsonError(
        "Gagal mengambil data leads.",
        500
      );
    }

    const total =
      count || 0;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          total / pageSize
        )
      );

    console.log(
      "[LEADS GET SUCCESS]",
      {
        page,
        pageSize,
        status,
        returned:
          data?.length || 0,
        total,
        totalPages,
      }
    );

    return NextResponse.json(
      {
        ok: true,
        data: data || [],
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
        total,
        totalPages,
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "[LEADS GET FATAL]",
      error
    );

    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}

/* ======================================================
   POST /api/leads
   PUBLIC
====================================================== */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const name =
      cleanString(
        body?.name,
        120
      );

    const email =
      cleanString(
        body?.email,
        200
      );

    const phone =
      cleanString(
        body?.phone,
        50
      );

    const message =
      cleanString(
        body?.message,
        5000
      );

    if (!name) {
      return jsonError(
        "Nama wajib diisi.",
        422
      );
    }

    if (!phone) {
      return jsonError(
        "Nomor WhatsApp wajib diisi.",
        422
      );
    }

    if (
  email &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
) {
  return jsonError(
    "Format email tidak valid.",
    422
  );
}

/* ==========================================
   RATE LIMIT
========================================== */

const turnstileToken =
  typeof body?.turnstileToken === "string"
    ? body.turnstileToken
        .trim()
        .slice(0, 5000)
    : "";

const forwardedFor =
  request.headers.get(
    "x-forwarded-for"
  );

const ip =
  forwardedFor
    ?.split(",")[0]
    ?.trim() ||
  request.headers.get(
    "x-real-ip"
  ) ||
  "unknown";

const rateLimit =
  await enforceLeadRateLimit(ip);

if (!rateLimit.allowed) {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
    },
    {
      status: 429,
    }
  );
}

/* ==========================================
   TURNSTILE
========================================== */

const turnstile =
  await verifyTurnstile(
    turnstileToken,
    request
  );

if (!turnstile.ok) {
  return NextResponse.json(
    {
      ok: false,
      error:
        turnstile.error ||
        "Verifikasi keamanan gagal.",
    },
    {
      status: 403,
    }
  );
}

/* ==========================================
   SUPABASE
========================================== */

const supabase =
  getServerSupabase();

    const {
      data,
      error,
    } =
      await supabase
        .from("leads")
        .insert({
          name,
          email:
            email || null,
          phone,
          message:
            message || null,
          status: "new",
        })
        .select()
        .single();

    if (error) {
      console.error(
        "[LEADS POST INSERT ERROR]",
        error
      );

      return jsonError(
        "Gagal menyimpan data konsultasi.",
        500
      );
    }

    console.log(
      "[LEADS POST SUCCESS]",
      {
        id: data?.id,
        name: data?.name,
        status: data?.status,
      }
    );

    return NextResponse.json(
      {
        ok: true,
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[LEADS POST FATAL]",
      error
    );

    return jsonError(
      "Terjadi kesalahan pada server.",
      500
    );
  }
}

/* ======================================================
   PATCH /api/leads
   ADMIN ONLY

   Digunakan untuk:
   - perubahan status
   - perubahan notes
====================================================== */

export async function PATCH(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (
      !admin.authorized ||
      !admin.user
    ) {
      return jsonError(
        "Unauthorized",
        401
      );
    }

    const body =
      await request.json();

    const leadId =
      cleanString(
        body?.id,
        100
      );

    if (!leadId) {
      return jsonError(
        "ID lead wajib diisi.",
        422
      );
    }

    const requestedStatus =
      body?.status !== undefined
        ? cleanString(
            body.status,
            50
          )
        : undefined;

    const requestedNotes =
      body?.notes !== undefined
        ? cleanString(
            body.notes,
            10000
          )
        : undefined;

    if (
      requestedStatus !== undefined &&
      requestedStatus !== "" &&
      !isValidStatus(
        requestedStatus
      )
    ) {
      return jsonError(
        "Status lead tidak valid.",
        422
      );
    }

    if (
      requestedStatus === undefined &&
      requestedNotes === undefined
    ) {
      return jsonError(
        "Tidak ada perubahan.",
        422
      );
    }

    const supabase =
      getServerSupabase();

    /* --------------------------------
       Ambil data lama
    -------------------------------- */

    const {
      data: existingLead,
      error: findError,
    } =
      await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .maybeSingle();

    if (findError) {
      console.error(
        "[LEAD PATCH FIND ERROR]",
        findError
      );

      return jsonError(
        "Gagal mengambil data lead.",
        500
      );
    }

    if (!existingLead) {
      return jsonError(
        "Lead tidak ditemukan.",
        404
      );
    }

    /* --------------------------------
       Siapkan perubahan
    -------------------------------- */

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      requestedStatus !== undefined &&
      requestedStatus !== ""
    ) {
      updateData.status =
        requestedStatus;
    }

    if (
      requestedNotes !== undefined
    ) {
      updateData.notes =
        requestedNotes;
    }

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return jsonError(
        "Tidak ada perubahan.",
        422
      );
    }

    /* --------------------------------
       Update lead
    -------------------------------- */

    const {
      data: updatedLead,
      error: updateError,
    } =
      await supabase
        .from("leads")
        .update(updateData)
        .eq("id", leadId)
        .select()
        .single();

    if (updateError) {
      console.error(
        "[LEAD PATCH UPDATE ERROR]",
        updateError
      );

      return jsonError(
        "Gagal memperbarui lead.",
        500
      );
    }

    /* --------------------------------
       Tentukan perubahan untuk audit
    -------------------------------- */

    const oldValues: Record<
      string,
      unknown
    > = {};

    const newValues: Record<
      string,
      unknown
    > = {};

    if (
      requestedStatus !== undefined &&
      requestedStatus !== ""
    ) {
      oldValues.status =
        existingLead.status ?? null;

      newValues.status =
        updatedLead.status ?? null;
    }

    if (
      requestedNotes !== undefined
    ) {
      oldValues.notes =
        existingLead.notes ?? null;

      newValues.notes =
        updatedLead.notes ?? null;
    }

    let action =
      "lead.updated";

    if (
      requestedStatus !== undefined &&
      requestedStatus !== "" &&
      requestedNotes !== undefined
    ) {
      action =
        "lead.status_and_notes_updated";
    } else if (
      requestedStatus !== undefined &&
      requestedStatus !== ""
    ) {
      action =
        "lead.status_changed";
    } else if (
      requestedNotes !== undefined
    ) {
      action =
        "lead.notes_changed";
    }

    /* --------------------------------
       Audit Log
    -------------------------------- */

    await writeLeadAuditLog({
      supabase,
      user: admin.user,
      leadId,
      action,
      oldValues,
      newValues,
    });

    console.log(
      "[LEAD PATCH SUCCESS]",
      {
        id: leadId,
        action,
      }
    );

    return NextResponse.json({
      ok: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error(
      "[LEAD PATCH FATAL]",
      error
    );

    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}

/* ======================================================
   DELETE /api/leads
   ADMIN ONLY

   Body:
   {
     "id": "uuid"
   }
====================================================== */

export async function DELETE(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (
      !admin.authorized ||
      !admin.user
    ) {
      return jsonError(
        "Unauthorized",
        401
      );
    }

    const body =
      await request.json();

    const leadId =
      cleanString(
        body?.id,
        100
      );

    if (!leadId) {
      return jsonError(
        "ID lead wajib diisi.",
        422
      );
    }

    const supabase =
      getServerSupabase();

    /* --------------------------------
       Ambil data sebelum dihapus
    -------------------------------- */

    const {
      data: existingLead,
      error: findError,
    } =
      await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .maybeSingle();

    if (findError) {
      console.error(
        "[LEAD DELETE FIND ERROR]",
        findError
      );

      return jsonError(
        "Gagal mengambil data lead.",
        500
      );
    }

    if (!existingLead) {
      return jsonError(
        "Lead tidak ditemukan.",
        404
      );
    }

    /* --------------------------------
       Delete
    -------------------------------- */

    const {
      data: deletedLead,
      error: deleteError,
    } =
      await supabase
        .from("leads")
        .delete()
        .eq("id", leadId)
        .select("id")
        .single();

    if (deleteError) {
      console.error(
        "[LEAD DELETE ERROR]",
        deleteError
      );

      return jsonError(
        "Gagal menghapus lead.",
        500
      );
    }

    /* --------------------------------
       Audit
    -------------------------------- */

    await writeLeadAuditLog({
      supabase,
      user: admin.user,
      leadId,
      action: "lead.deleted",
      oldValues: {
        name:
          existingLead.name ?? null,
        email:
          existingLead.email ?? null,
        phone:
          existingLead.phone ?? null,
        status:
          existingLead.status ?? null,
      },
      newValues: {},
    });

    console.log(
      "[LEAD DELETE SUCCESS]",
      {
        id:
          deletedLead?.id,
      }
    );

    return NextResponse.json({
      ok: true,
      id: deletedLead?.id,
    });
  } catch (error) {
    console.error(
      "[LEAD DELETE FATAL]",
      error
    );

    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}