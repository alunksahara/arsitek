import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminSupabase } from "@/lib/supabase-admin";

export type UserRole = "admin" | "editor";

async function getAuthContext() {
  const authSupabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await authSupabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false,
      user: null,
      role: null as UserRole | null,
      supabase: authSupabase,
    };
  }

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
  const userEmail =
    user.email?.trim().toLowerCase() || "";
  const adminSupabase = createAdminSupabase();

  if (adminEmail && userEmail === adminEmail) {
    return {
      authorized: true,
      user,
      role: "admin" as UserRole,
      supabase: adminSupabase,
    };
  }

  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("role,active")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.active === false ||
    (profile.role !== "admin" && profile.role !== "editor")
  ) {
    return {
      authorized: false,
      user,
      role: null as UserRole | null,
      supabase: authSupabase,
    };
  }

  return {
    authorized: true,
    user,
    role: profile.role as UserRole,
    supabase: adminSupabase,
  };
}

export async function requireStaff() {
  return getAuthContext();
}

export async function requireAdmin() {
  const auth = await getAuthContext();

  if (!auth.authorized || auth.role !== "admin") {
    return {
      ...auth,
      authorized: false,
    };
  }

  return auth;
}

export async function requireEditorOrAdmin() {
  return getAuthContext();
}
