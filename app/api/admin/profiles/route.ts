import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { jsonError } from "@/lib/security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const { authorized, supabase } = await requireAdmin();
  if (!authorized) return jsonError("Unauthorized", 401);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,role,active,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PROFILES GET]", error);
      return jsonError("Gagal mengambil data team.", 500);
    }

    return NextResponse.json(
      { profiles: data || [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[PROFILES GET FATAL]", error);
    return jsonError("Terjadi kesalahan server.", 500);
  }
}

export async function POST(request: Request) {
  const { authorized, user } = await requireAdmin();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const role = body?.role === "admin" ? "admin" : body?.role === "editor" ? "editor" : null;

    if (!emailPattern.test(email) || email.length > 254) {
      return jsonError("Email tidak valid.", 400);
    }
    if (!role) return jsonError("Role harus admin atau editor.", 400);

    const admin = createAdminSupabase();
    const { data: existing } = await admin
      .from("profiles")
      .select("id,active")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return jsonError(existing.active ? "User sudah terdaftar." : "User sudah terdaftar tetapi nonaktif. Aktifkan dari daftar user.", 409);
    }

    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email);
    if (inviteError || !invited.user) {
      console.error("[PROFILE INVITE]", inviteError);
      return jsonError("Gagal mengirim undangan user. Pastikan konfigurasi email Supabase sudah aktif.", 400);
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .upsert({ id: invited.user.id, email, role, active: true, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("id,email,role,active,created_at,updated_at")
      .single();

    if (profileError) {
      console.error("[PROFILE UPSERT]", profileError);
      return jsonError("Undangan terkirim, tetapi profil user gagal dibuat. Hubungi administrator.", 500);
    }

    await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "profile.invite",
      entity_type: "profile",
      entity_id: invited.user.id,
      details: { email, role },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("[PROFILE INVITE FATAL]", error);
    return jsonError("Request tidak valid.", 400);
  }
}
