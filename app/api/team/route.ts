import { NextResponse } from "next/server";
import { requireStaff, requireAdmin } from "@/lib/admin";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { jsonError } from "@/lib/security";

function cleanSkills(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 20);
}

function validate(body: any) {
  const name = String(body?.name || "").trim();
  const position = String(body?.position || "").trim();
  const bio = String(body?.bio || "").trim();
  const photo_url = String(body?.photo_url || "").trim();
  const sort_order = Number(body?.sort_order ?? 0);
  const published = body?.published !== false;
  const skills = cleanSkills(body?.skills);

  if (!name || name.length > 120) throw new Error("Nama team wajib diisi dan maksimal 120 karakter.");
  if (!position || position.length > 120) throw new Error("Jabatan wajib diisi dan maksimal 120 karakter.");
  if (bio.length > 2000) throw new Error("Bio maksimal 2000 karakter.");
  if (photo_url && !/^https?:\/\//i.test(photo_url)) throw new Error("URL foto harus berupa URL http/https.");
  if (!Number.isInteger(sort_order) || sort_order < 0 || sort_order > 9999) throw new Error("Urutan harus bilangan bulat 0 atau lebih.");

  return { name, position, bio, photo_url: photo_url || null, skills, sort_order, published };
}

export async function GET() {
  const auth = await requireStaff();
  const client = auth.authorized ? auth.supabase : createAdminSupabase();

  try {
    let query = client
      .from("team_members")
      .select("id,name,photo_url,position,bio,skills,sort_order,published,created_at,updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!auth.authorized) query = query.eq("published", true);

    const { data, error } = await query;
    if (error) {
      console.error("[TEAM GET]", error);
      return jsonError("Gagal mengambil data team.", 500);
    }

    return NextResponse.json(
      { team: data || [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[TEAM GET FATAL]", error);
    return jsonError("Terjadi kesalahan server.", 500);
  }
}

export async function POST(request: Request) {
  const { authorized, user, supabase } = await requireStaff();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  try {
    const body = await request.json();
    const values = validate(body);
    const { data, error } = await supabase
      .from("team_members")
      .insert(values)
      .select("id,name,photo_url,position,bio,skills,sort_order,published,created_at,updated_at")
      .single();

    if (error) {
      console.error("[TEAM POST]", error);
      return jsonError("Gagal menambahkan anggota team.", 400);
    }

    const admin = createAdminSupabase();
    await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "team.create",
      entity_type: "team_member",
      entity_id: data.id,
      details: { name: data.name, position: data.position },
    });

    return NextResponse.json({ team: data }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Request tidak valid.", 400);
  }
}

export async function PATCH(request: Request) {
  const { authorized, user, supabase } = await requireStaff();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return jsonError("ID team tidak valid.", 400);
    }

    const values = validate(body);
    const { data, error } = await supabase
      .from("team_members")
      .update(values)
      .eq("id", id)
      .select("id,name,photo_url,position,bio,skills,sort_order,published,created_at,updated_at")
      .single();

    if (error) {
      console.error("[TEAM PATCH]", error);
      return jsonError("Gagal memperbarui anggota team.", 400);
    }

    const admin = createAdminSupabase();
    await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "team.update",
      entity_type: "team_member",
      entity_id: data.id,
      details: { name: data.name, position: data.position },
    });

    return NextResponse.json({ team: data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Request tidak valid.", 400);
  }
}

export async function DELETE(request: Request) {
  const { authorized, user } = await requireAdmin();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return jsonError("ID team tidak valid.", 400);
    }

    const admin = createAdminSupabase();
    const { data: existing, error: findError } = await admin
      .from("team_members")
      .select("id,name,photo_url")
      .eq("id", id)
      .single();

    if (findError || !existing) return jsonError("Anggota team tidak ditemukan.", 404);

    const { error } = await admin.from("team_members").delete().eq("id", id);
    if (error) {
      console.error("[TEAM DELETE]", error);
      return jsonError("Gagal menghapus anggota team.", 400);
    }

    await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "team.delete",
      entity_type: "team_member",
      entity_id: id,
      details: { name: existing.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError("Request tidak valid.", 400);
  }
}
