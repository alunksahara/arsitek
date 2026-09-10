import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminSupabase } from "@/lib/supabase-admin";

export async function requireAdmin() {
  // Client berbasis session:
  // hanya digunakan untuk mengetahui siapa user yang sedang login.
  const authSupabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await authSupabase.auth.getUser();

  if (error || !user) {
    console.log("[ADMIN] No authenticated user");

    return {
      authorized: false,
      user: null,
      supabase: authSupabase,
    };
  }

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

  const userEmail =
    user.email?.trim().toLowerCase() || "";

  const authorized =
    Boolean(adminEmail) &&
    userEmail === adminEmail;

  console.log("[ADMIN] User:", userEmail);
  console.log("[ADMIN] ADMIN_EMAIL:", adminEmail);
  console.log("[ADMIN] Authorized:", authorized);

  // Jika bukan admin, jangan berikan privileged client.
  if (!authorized) {
    return {
      authorized: false,
      user,
      supabase: authSupabase,
    };
  }

  // Admin yang sudah terverifikasi menggunakan
  // Supabase server/admin client untuk operasi database.
  const adminSupabase = createAdminSupabase();

  return {
    authorized: true,
    user,
    supabase: adminSupabase,
  };
}