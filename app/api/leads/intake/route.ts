import { enforceLeadRateLimit, verifyTurnstile } from "@/lib/rate-limit";
import { jsonError } from "@/lib/security";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

function cleanString(value: unknown, maxLength = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanNumber(value: unknown, min = 0, max = 1000000000000): number | null {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = cleanString(body?.name, 120);
    const phone = cleanString(body?.phone, 50);
    const email = cleanString(body?.email, 200);
    const projectType = cleanString(body?.projectType, 120);
    const budget = cleanString(body?.budget, 200);
    const message = cleanString(body?.message, 5000);

    if (!name) return jsonError("Nama wajib diisi.", 422);
    if (!phone) return jsonError("Nomor WhatsApp wajib diisi.", 422);
    if (!projectType) return jsonError("Jenis proyek wajib dipilih.", 422);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Format email tidak valid.", 422);
    }

    const estimator = body?.estimatorContext;
    const estimatorProjectType = cleanString(estimator?.projectType, 120) || null;
    const estimatorDesignLevel = cleanString(estimator?.designLevel, 50) || null;
    const estimatorArea = cleanNumber(estimator?.area, 1, 100000) ?? null;
    const estimatorEstimatedMin = cleanNumber(estimator?.estimatedMin, 0, 1000000000000) ?? null;
    const estimatorEstimatedMax = cleanNumber(estimator?.estimatedMax, 0, 1000000000000) ?? null;

    const turnstileToken = cleanString(body?.turnstileToken, 5000);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = await enforceLeadRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
        { status: 429 }
      );
    }

    const turnstile = await verifyTurnstile(turnstileToken, request);
    if (!turnstile.ok) {
      return NextResponse.json(
        { ok: false, error: turnstile.error || "Verifikasi keamanan gagal." },
        { status: 403 }
      );
    }

    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        email: email || null,
        project_type: projectType,
        budget: budget || null,
        message: message || null,
        estimator_project_type: estimatorProjectType,
        estimator_design_level: estimatorDesignLevel,
        estimator_area: estimatorArea,
        estimator_estimated_min: estimatorEstimatedMin,
        estimator_estimated_max: estimatorEstimatedMax,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("[LEAD INTAKE INSERT ERROR]", error);
      return jsonError("Gagal menyimpan data konsultasi.", 500);
    }

    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    console.error("[LEAD INTAKE FATAL]", error);
    return jsonError("Terjadi kesalahan pada server.", 500);
  }
}
