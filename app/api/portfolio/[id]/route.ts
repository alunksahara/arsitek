import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = ["admin", "editor"];

function cleanString(value: unknown, max = 500) {
  if (typeof value !== "string") return null;

  const result = value.trim();

  if (!result) return null;

  return result.slice(0, max);
}

function cleanSlug(value: unknown) {
  if (typeof value !== "string") return null;

  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);

  return slug || null;
}

function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/**
 * UPDATE
 */
export async function PATCH(
  request: Request,
  context: Context
) {
  const {
    authorized,
    supabase,
    user,
  } = await requireAdmin();

  if (!authorized || !user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;

  if (!validUuid(id)) {
    return jsonError("ID portfolio tidak valid.", 400);
  }

  try {
    const body = await request.json();

    const patch: Record<string, unknown> = {};

    if ("title" in body) {
      const title = cleanString(body.title, 160);

      if (!title) {
        return jsonError("Judul tidak boleh kosong.", 400);
      }

      patch.title = title;
    }

    if ("slug" in body) {
      const slug = cleanSlug(body.slug);

      if (!slug) {
        return jsonError("Slug tidak boleh kosong.", 400);
      }

      patch.slug = slug;
    }

    if ("location" in body) {
      patch.location = cleanString(body.location, 200);
    }

    if ("category" in body) {
      patch.category = cleanString(body.category, 120);
    }

    if ("image_url" in body) {
      const imageUrl = cleanString(body.image_url, 1000);

      if (!imageUrl) {
        return jsonError("Image URL tidak boleh kosong.", 400);
      }

      patch.image_url = imageUrl;
    }

    if ("description" in body) {
      patch.description = cleanString(body.description, 5000);
    }

    if ("featured" in body) {
      if (typeof body.featured !== "boolean") {
        return jsonError("Featured harus boolean.", 400);
      }

      patch.featured = body.featured;
    }

    if ("published" in body) {
      if (typeof body.published !== "boolean") {
        return jsonError("Published harus boolean.", 400);
      }

      patch.published = body.published;
    }

    if ("sort_order" in body) {
      const sortOrder = Number(body.sort_order);

      if (!Number.isFinite(sortOrder)) {
        return jsonError("Sort order tidak valid.", 400);
      }

      patch.sort_order = Math.max(
        0,
        Math.trunc(sortOrder)
      );
    }

    if (!Object.keys(patch).length) {
      return jsonError("Tidak ada perubahan.", 400);
    }

    patch.updated_at = new Date().toISOString();

    const {
      data,
      error,
    } = await supabase
      .from("portfolio_projects")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PORTFOLIO UPDATE]", error);

      if (error.code === "23505") {
        return jsonError(
          "Slug portfolio sudah digunakan.",
          409
        );
      }

      return jsonError("Gagal memperbarui portfolio.", 400);
    }

    const {
      error: auditError,
    } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: user.id,
        action: "portfolio.update",
        entity_type: "portfolio",
        entity_id: id,
        details: {
          changed: Object.keys(patch),
        },
      });

    if (auditError) {
      console.error("[PORTFOLIO UPDATE AUDIT]", auditError);
    }

    return NextResponse.json({
      project: data,
    });
  } catch (error) {
    console.error("[PORTFOLIO UPDATE FATAL]", error);
    return jsonError("Request tidak valid.", 400);
  }
}

/**
 * DELETE
 */
export async function DELETE(
  _request: Request,
  context: Context
) {
  const {
    authorized,
    supabase,
    user,
  } = await requireAdmin();

  if (!authorized || !user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;

  if (!validUuid(id)) {
    return jsonError("ID portfolio tidak valid.", 400);
  }

  try {
    const {
      data: existing,
      error: findError,
    } = await supabase
      .from("portfolio_projects")
      .select("id,title,slug")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return jsonError(
        "Portfolio tidak ditemukan.",
        404
      );
    }

    const {
      error,
    } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[PORTFOLIO DELETE]", error);
      return jsonError(
        "Gagal menghapus portfolio.",
        400
      );
    }

    const {
      error: auditError,
    } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: user.id,
        action: "portfolio.delete",
        entity_type: "portfolio",
        entity_id: id,
        details: {
          title: existing.title,
          slug: existing.slug,
        },
      });

    if (auditError) {
      console.error("[PORTFOLIO DELETE AUDIT]", auditError);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[PORTFOLIO DELETE FATAL]", error);
    return jsonError("Terjadi kesalahan server.", 500);
  }
}