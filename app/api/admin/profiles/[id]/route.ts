import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { jsonError } from "@/lib/security";

type Context = { params: Promise<{ id: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, context: Context) {
  const { authorized, user } = await requireAdmin();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  const { id } = await context.params;
  if (!uuidPattern.test(id)) return jsonError("ID user tidak valid.", 400);

  try {
    const body = await request.json();
    const patch: Record<string, unknown> = {};

    if ("role" in body) {
      if (body.role !== "admin" && body.role !== "editor") return jsonError("Role harus admin atau editor.", 400);
      patch.role = body.role;
    }
    if ("active" in body) {
      if (typeof body.active !== "boolean") return jsonError("Active harus boolean.", 400);
      patch.active = body.active;
    }
    if (!Object.keys(patch).length) return jsonError("Tidak ada perubahan.", 400);

    const admin = createAdminSupabase();
    const { data: target, error: targetError } = await admin
      .from("profiles")
      .select("id,email,role,active")
      .eq("id", id)
      .maybeSingle();
    if (targetError || !target) return jsonError("User tidak ditemukan.", 404);

    const primaryAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
    if (target.email?.trim().toLowerCase() === primaryAdminEmail && (patch.role === "editor" || patch.active === false)) {
      return jsonError("Akun ADMIN_EMAIL utama tidak boleh diturunkan role atau dinonaktifkan.", 400);
    }
    if (id === user.id && (patch.role === "editor" || patch.active === false)) {
      return jsonError("Akun admin yang sedang digunakan tidak boleh diturunkan role atau dinonaktifkan.", 400);
    }

    const willLoseAdmin = target.role === "admin" && target.active === true && (patch.role === "editor" || patch.active === false);
    if (willLoseAdmin) {
      const { count, error: countError } = await admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin")
        .eq("active", true);
      if (countError) {
        console.error("[PROFILE ADMIN COUNT]", countError);
        return jsonError("Tidak dapat memvalidasi jumlah admin aktif.", 500);
      }
      if ((count || 0) <= 1) return jsonError("Minimal harus ada satu Admin aktif.", 400);
    }

    patch.updated_at = new Date().toISOString();
    const { data, error } = await admin
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("id,email,role,active,created_at,updated_at")
      .single();
    if (error) {
      console.error("[PROFILE UPDATE]", error);
      return jsonError("Gagal memperbarui anggota team.", 400);
    }

    const { error: auditError } = await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "profile.update",
      entity_type: "profile",
      entity_id: id,
      details: { changed: Object.keys(patch), values: patch },
    });
    if (auditError) console.error("[PROFILE UPDATE AUDIT]", auditError);

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error("[PROFILE UPDATE FATAL]", error);
    return jsonError("Request tidak valid.", 400);
  }
}
