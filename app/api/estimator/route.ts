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
  market_adjustment_percent: 0,
};

function numberValue(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeSettings(body: Record<string, unknown>) {
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
    market_adjustment_percent: numberValue(body.market_adjustment_percent, DEFAULT_SETTINGS.market_adjustment_percent),
  };

  const rates = [settings.essential_rate, settings.signature_rate, settings.premium_rate];
  const multipliers = [
    settings.rumah_baru_multiplier,
    settings.renovasi_multiplier,
    settings.villa_multiplier,
    settings.commercial_multiplier,
  ];

  if (rates.some((value) => value < 0 || value > 10000000)) {
    return { error: "Rate harus antara 0 dan Rp10.000.000 per m²." };
  }

  if (multipliers.some((value) => value <= 0 || value > 10)) {
    return { error: "Multiplier harus lebih besar dari 0 dan maksimal 10." };
  }

  if (settings.min_range_multiplier <= 0 || settings.max_range_multiplier <= 0) {
    return { error: "Range estimasi harus lebih besar dari 0." };
  }

  if (settings.max_range_multiplier < settings.min_range_multiplier) {
    return { error: "Range maksimum tidak boleh lebih kecil dari range minimum." };
  }

  if (settings.min_area < 1 || settings.min_area > 100000) {
    return { error: "Minimum luas harus antara 1 dan 100.000 m²." };
  }

  if (settings.market_adjustment_percent < -30 || settings.market_adjustment_percent > 30) {
    return { error: "Market adjustment harus antara -30% dan +30%." };
  }

  return { settings };
}

function toPublicSettings(raw: Record<string, unknown> | null) {
  const settings = normalizeSettings({ ...(raw || {}) });
  if ("error" in settings) return DEFAULT_SETTINGS;

  const factor = 1 + settings.settings.market_adjustment_percent / 100;

  return {
    id: raw?.id ?? 1,
    essential_rate: settings.settings.essential_rate * factor,
    signature_rate: settings.settings.signature_rate * factor,
    premium_rate: settings.settings.premium_rate * factor,
    base_essential_rate: settings.settings.essential_rate,
    base_signature_rate: settings.settings.signature_rate,
    base_premium_rate: settings.settings.premium_rate,
    rumah_baru_multiplier: settings.settings.rumah_baru_multiplier,
    renovasi_multiplier: settings.settings.renovasi_multiplier,
    villa_multiplier: settings.settings.villa_multiplier,
    commercial_multiplier: settings.settings.commercial_multiplier,
    min_range_multiplier: settings.settings.min_range_multiplier,
    max_range_multiplier: settings.settings.max_range_multiplier,
    min_area: settings.settings.min_area,
    market_adjustment_percent: settings.settings.market_adjustment_percent,
    updated_at: raw?.updated_at ?? null,
  };
}

export async function GET() {
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("estimator_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("[ESTIMATOR GET]", error);
      return jsonError("Gagal mengambil konfigurasi estimator.", 500);
    }

    return NextResponse.json(
      { settings: toPublicSettings(data) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[ESTIMATOR GET ERROR]", error);
    return jsonError("Terjadi kesalahan saat mengambil konfigurasi estimator.", 500);
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

    const result = normalizeSettings(body as Record<string, unknown>);
    if ("error" in result) {
      return jsonError(result.error || "Konfigurasi estimator tidak valid.", 400);
    }

    const supabase = createAdminSupabase();
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
      .select()
      .single();

    if (error) {
      console.error("[ESTIMATOR UPDATE]", error);
      return jsonError("Gagal menyimpan konfigurasi estimator.", 400);
    }

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "estimator.update",
      entity_type: "estimator_settings",
      entity_id: null,
      details: result.settings,
    });

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error("[ESTIMATOR PATCH ERROR]", error);
    return jsonError("Request estimator tidak valid.", 400);
  }
}
