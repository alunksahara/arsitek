import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServerSupabase } from "@/lib/supabase-server";

const jsonError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeLocation(input: any) {
  return {
    city: String(input.city || "").trim(),
    slug: String(input.slug || "").trim().toLowerCase(),
    province: String(input.province || "Jawa Timur").trim(),
    seo_title: String(input.seo_title || "").trim(),
    seo_description: String(input.seo_description || "").trim(),
    h1: String(input.h1 || "").trim(),
    intro: String(input.intro || "").trim(),
    local_context: String(input.local_context || "").trim(),
    services: Array.isArray(input.services)
      ? input.services.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [],
    process: Array.isArray(input.process)
      ? input.process.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [],
    faqs: Array.isArray(input.faqs)
      ? input.faqs
          .map((item: any) => ({
            question: String(item?.question || "").trim(),
            answer: String(item?.answer || "").trim(),
          }))
          .filter((item: { question: string; answer: string }) => item.question && item.answer)
      : [],
    published: input.published !== false,
    sort_order: Number.isFinite(Number(input.sort_order))
      ? Number(input.sort_order)
      : 0,
  };
}

function validateLocation(input: ReturnType<typeof normalizeLocation>) {
  if (
    !input.city ||
    !input.slug ||
    !input.seo_title ||
    !input.seo_description ||
    !input.h1 ||
    !input.intro
  ) {
    return "City, slug, SEO title, SEO description, H1, dan intro wajib diisi";
  }

  if (!SLUG_PATTERN.test(input.slug)) {
    return "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)";
  }

  if (input.seo_title.length > 70) {
    return "SEO title maksimal 70 karakter";
  }

  if (input.seo_description.length > 170) {
    return "SEO description maksimal 170 karakter";
  }

  if (input.sort_order < 0 || !Number.isInteger(input.sort_order)) {
    return "Urutan harus berupa bilangan bulat 0 atau lebih";
  }

  return null;
}

async function readJson(request: Request) {
  try {
    return { data: await request.json(), error: null };
  } catch {
    return { data: null, error: "Body JSON tidak valid" };
  }
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return jsonError("Unauthorized", 401);

  const { data, error } = await auth.supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("city", { ascending: true });

  if (error) {
    console.error("[LOCATIONS GET]", error);
    return jsonError("Gagal mengambil data lokasi", 500);
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized || !auth.user) return jsonError("Unauthorized", 401);

  const body = await readJson(request);
  if (body.error) return jsonError(body.error, 400);

  const input = normalizeLocation(body.data || {});
  const validationError = validateLocation(input);
  if (validationError) return jsonError(validationError, 400);

  const { data, error } = await auth.supabase
    .from("locations")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    console.error("[LOCATIONS POST]", error);
    return jsonError(
      error.code === "23505" ? "Slug lokasi sudah digunakan" : "Gagal membuat lokasi",
      error.code === "23505" ? 409 : 500
    );
  }

  await writeAudit(auth.user.id, "location.create", data.id, data);
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized || !auth.user) return jsonError("Unauthorized", 401);

  const body = await readJson(request);
  if (body.error) return jsonError(body.error, 400);

  const id = String(body.data?.id || "").trim();
  if (!id) return jsonError("ID lokasi wajib diisi", 400);

  const input = normalizeLocation(body.data || {});
  const validationError = validateLocation(input);
  if (validationError) return jsonError(validationError, 400);

  const { data: oldData, error: oldError } = await auth.supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (oldError || !oldData) return jsonError("Lokasi tidak ditemukan", 404);

  const { data, error } = await auth.supabase
    .from("locations")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[LOCATIONS PATCH]", error);
    return jsonError(
      error.code === "23505" ? "Slug lokasi sudah digunakan" : "Gagal memperbarui lokasi",
      error.code === "23505" ? 409 : 500
    );
  }

  await writeAudit(auth.user.id, "location.update", id, {
    before: oldData,
    after: data,
  });

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized || !auth.user) return jsonError("Unauthorized", 401);

  const body = await readJson(request);
  if (body.error) return jsonError(body.error, 400);

  const id = String(body.data?.id || "").trim();
  if (!id) return jsonError("ID lokasi wajib diisi", 400);

  const { data: oldData, error: oldError } = await auth.supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (oldError || !oldData) return jsonError("Lokasi tidak ditemukan", 404);

  const { error } = await auth.supabase
    .from("locations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[LOCATIONS DELETE]", error);
    return jsonError("Gagal menghapus lokasi", 500);
  }

  await writeAudit(auth.user.id, "location.delete", id, oldData);
  return NextResponse.json({ success: true });
}

async function writeAudit(
  actorId: string,
  action: string,
  entityId: string,
  details: unknown
) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: "location",
    entity_id: entityId,
    details,
  });

  if (error) console.error("[LOCATION AUDIT]", error);
}
