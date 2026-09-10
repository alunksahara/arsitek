import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";

export async function GET(
  request: Request
) {
  const {
    authorized,
    supabase,
  } = await requireAdmin();

  if (!authorized) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const url = new URL(request.url);

    const page = Math.max(
      1,
      Number(url.searchParams.get("page")) || 1
    );

    const pageSize = Math.min(
      50,
      Math.max(
        5,
        Number(url.searchParams.get("pageSize")) || 15
      )
    );

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data,
      error,
      count,
    } = await supabase
      .from("audit_logs")
      .select(
        "id,actor_id,action,entity_type,entity_id,details,created_at",
        {
          count: "exact",
        }
      )
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) {
      console.error("[AUDIT GET]", error);

      return jsonError(
        "Gagal mengambil audit log.",
        500
      );
    }

    const total = count || 0;

    return NextResponse.json(
      {
        logs: data || [],
        total,
        page,
        pageSize,
        totalPages: Math.max(
          1,
          Math.ceil(total / pageSize)
        ),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "[AUDIT GET FATAL]",
      error
    );

    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}