import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";

export async function GET() {
  const {
    authorized,
    supabase,
  } = await requireAdmin();

  if (!authorized) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(
        "id,email,role,active,created_at,updated_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("[PROFILES GET]", error);
      return jsonError(
        "Gagal mengambil data team.",
        500
      );
    }

    return NextResponse.json(
      {
        profiles: data || [],
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[PROFILES GET FATAL]", error);
    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}