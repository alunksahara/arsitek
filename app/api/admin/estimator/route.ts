import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { jsonError } from "@/lib/security";

const DEFAULT_SETTINGS = {
  essential_rate: 180000,
  signature_rate: 300000,
  premium_rate: 450000,
  rumah_baru_multiplier: 1,
  renovasi_multiplier: 1.15,
  villa_multiplier: 1.2,
  commercial_multiplier: 1.3,
  min_range_multiplier: 0.85,
  max_range_multiplier: 1.25,
  min_area: 20,
};

function numberValue(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalize(body: Record<string, unknown>) {
  const settings = {
    essential_rate: numberValue(body.essential_rate, DEFAULT_SETTINGS.essential_rate),
    signature_rate: numberValue(body.signature_rate, DEFAULT_SETTINGS.signature_rate),
    premium_rate: numberValue(body.premium_rate, DEFAULT_SETTINGS.premium_rate),
    rumah_baru_multiplier: numberValue(body.rumah_baru_multiplier, DEFAULT_SETTINGS.rumah_baru_multiplier),
    renovasi_multiplier: numberValue(body.renovasi_multiplier, DEFAULT_SETTINGS.renovasi_multiplier),
    villa_multiplier: numberValue(body.villa_multiplier, DEFAULT_SETTINGS.villa_multiplier),
    commercial_multiplier: numberValue(body.commercial_multiplier, DEFAULT_SETTINGS.commercial_multiplier),
    min_range_multiplier: numberValue(body.min_range_multiplier, DEFAULT_SETTINGS.min_range_multiplier),
    max_range_multiplier: numberValue(body.max_range_multiplier, DEFAULT_SETTINGS.max_range_multiplier),
    min_area: numberValue(body.min_area, DEFAULT_SETTINGS.min_area),
  };

  if ([settings.essential_rate, settings.signature_rate, settings.premium_rate].some((value) => value < 0 || value > 10000000)) {
    return { error: "Rate harus antara 0 dan Rp10.000.000 per m²." };
  }

  if ([
    settings.rumah_baru_multiplier,
    settings.renovasi_multiplier,
    settings.villa_multiplier,
    settings.commercial_multiplier,
  ].some((value) => value <= 0 || value > 10)) {
    return { error: "Multiplier harus lebih besar dari 0 dan maksimal 10." };
  }

  if (settings.min_range_multiplier <= 0 || settings.max_range_multiplier <= 0) {
    return { error: "Range estimasi harus lebih besar dari 0." };
  }

  if (settings.min_range_multiplier >= settings.max_range_multiplier) {
    return { error: "Range minimum harus lebih kecil dari range maksimum." };
  }

  if (settings.min_area < 1 || settings.min_area > 100000) {
    return { error: "Minimum luas harus antara 1 dan 100.000 m²." };
  }

  return { settings };
}

export async function GET() {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("estimator_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("[ADMIN ESTIMATOR GET]", error);
      return jsonError("Gagal mengambil konfigurasi estimator.", 500);
    }

    return NextResponse.json(
      { settings: { ...DEFAULT_SETTINGS, ...(data || {}) } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[ADMIN ESTIMATOR GET ERROR]", error);
    return jsonError("Terjadi kesalahan server.", 500);
  }
}

export async function PATCH(request: Request) {
  const { authorized, user } = await requireAdmin();

  if (!authorized || !user) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Format request tidak valid.", 400);
    }

    const result = normalize(body as Record<string, unknown>);

    if ("error" in result) {
      const message = result.error;
      return jsonError(message, 400);
    }

    const supabase = createAdminSupabase();
    const { data: before } = await supabase
      .from("estimator_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const { data, error } = await supabase
      .from("estimator_settings")
      .upsert(
        {
          id: 1,
          ...result.settings,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (error) {
      console.error("[ADMIN ESTIMATOR PATCH]", error);
      return jsonError("Gagal menyimpan konfigurasi estimator.", 400);
    }

    const { error: auditError } = await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "estimator.update",
      entity_type: "estimator_settings",
      entity_id: null,
      details: {
        old: before || null,
        new: result.settings,
      },
    });

    if (auditError) {
      console.error("[ADMIN ESTIMATOR AUDIT]", auditError);
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error("[ADMIN ESTIMATOR PATCH ERROR]", error);
    return jsonError("Request estimator tidak valid.", 400);
  }
}
