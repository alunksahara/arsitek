import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";
import { createClient } from "@supabase/supabase-js";

const STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

/**
 * Supabase server client.
 *
 * Mengikuti struktur .env.local V4:
 *
 * NEXT_PUBLIC_SUPABASE_URL
 * SUPABASE_SECRET_KEY
 *
 * Client ini hanya digunakan di server.
 */
function getServerSupabase() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL belum dikonfigurasi."
    );
  }

  if (!supabaseSecretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY belum dikonfigurasi."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function GET() {
  /**
   * =====================================================
   * 1. CEK ADMIN
   * =====================================================
   *
   * requireAdmin tetap digunakan untuk memastikan
   * hanya admin yang boleh meminta statistik.
   */
  const {
    authorized,
  } = await requireAdmin();

  if (!authorized) {
    return jsonError(
      "Unauthorized",
      401
    );
  }

  try {
    /**
     * =====================================================
     * 2. SERVER SUPABASE
     * =====================================================
     *
     * Setelah user dipastikan admin, gunakan
     * SUPABASE_SECRET_KEY untuk membaca database.
     *
     * Ini mencegah statistik terkena pembatasan RLS.
     */
    const supabase =
      getServerSupabase();

    /**
     * =====================================================
     * 3. TOTAL SEMUA LEAD
     * =====================================================
     */
    const {
      count: total,
      error: totalError,
    } = await supabase
      .from("leads")
      .select("id", {
        count: "exact",
        head: true,
      });

    if (totalError) {
      console.error(
        "[LEADS STATS TOTAL ERROR]",
        {
          message: totalError.message,
          details: totalError.details,
          hint: totalError.hint,
          code: totalError.code,
        }
      );

      return jsonError(
        "Gagal menghitung total leads.",
        500
      );
    }

    /**
     * =====================================================
     * 4. HASIL AWAL
     * =====================================================
     */
    const out: Record<string, number> = {
      total: total ?? 0,
      all: total ?? 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      won: 0,
      lost: 0,
      conversion_rate: 0,
    };

    /**
     * =====================================================
     * 5. HITUNG LEAD PER STATUS
     * =====================================================
     */
    for (const status of STATUSES) {
      const {
        count,
        error,
      } = await supabase
        .from("leads")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", status);

      if (error) {
        console.error(
          `[LEADS STATS ${status.toUpperCase()} ERROR]`,
          {
            status,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          }
        );

        return jsonError(
          `Gagal menghitung leads status ${status}.`,
          500
        );
      }

      out[status] =
        count ?? 0;
    }

    /**
     * =====================================================
     * 6. CONVERSION RATE
     * =====================================================
     */
    out.conversion_rate =
      out.total > 0
        ? Number(
            (
              (out.won / out.total) *
              100
            ).toFixed(1)
          )
        : 0;

    /**
     * =====================================================
     * 7. LOG SUCCESS
     * =====================================================
     */
    console.log(
      "[LEADS STATS SUCCESS]",
      {
        total: out.total,
        all: out.all,
        new: out.new,
        contacted: out.contacted,
        qualified: out.qualified,
        won: out.won,
        lost: out.lost,
        conversion_rate:
          out.conversion_rate,
      }
    );

    /**
     * =====================================================
     * 8. RESPONSE
     * =====================================================
     */
    return NextResponse.json(
      out,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "[LEADS STATS EXCEPTION]",
      {
        message:
          error instanceof Error
            ? error.message
            : String(error),

        stack:
          error instanceof Error
            ? error.stack
            : undefined,
      }
    );

    return jsonError(
      "Gagal mengambil statistik leads.",
      500
    );
  }
}