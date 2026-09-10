import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";

function cleanText(value: unknown, max = 120) {
  if (typeof value !== "string") return null;

  const valueTrimmed = value.trim();

  if (!valueTrimmed) return null;

  return valueTrimmed.slice(0, max);
}

function numberValue(
  value: unknown,
  fallback = 0
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export async function GET() {
  const {
    authorized,
    supabase,
  } = await requireAdmin();

  if (!authorized) {
    return jsonError(
      "Unauthorized",
      401
    );
  }

  try {
    const [
      settingsResult,
      projectTypesResult,
      configResult,
    ] = await Promise.all([
      supabase
        .from("estimator_settings")
        .select("*")
        .order("rate_per_m2", {
          ascending: true,
        }),

      supabase
        .from("estimator_project_types")
        .select("*")
        .order("project_label", {
          ascending: true,
        }),

      supabase
        .from("estimator_config")
        .select("*")
        .limit(1)
        .maybeSingle(),
    ]);

    if (settingsResult.error) {
      console.error(
        "[ADMIN ESTIMATOR SETTINGS]",
        settingsResult.error
      );

      return jsonError(
        "Gagal mengambil tarif estimator.",
        500
      );
    }

    if (projectTypesResult.error) {
      console.error(
        "[ADMIN ESTIMATOR PROJECT TYPES]",
        projectTypesResult.error
      );

      return jsonError(
        "Gagal mengambil jenis proyek.",
        500
      );
    }

    if (configResult.error) {
      console.error(
        "[ADMIN ESTIMATOR CONFIG]",
        configResult.error
      );

      return jsonError(
        "Gagal mengambil konfigurasi estimator.",
        500
      );
    }

    return NextResponse.json(
      {
        settings:
          settingsResult.data || [],

        projectTypes:
          projectTypesResult.data || [],

        config:
          configResult.data || null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "[ADMIN ESTIMATOR GET]",
      error
    );

    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}

export async function PATCH(
  request: Request
) {
  const {
    authorized,
    supabase,
    user,
  } = await requireAdmin();

  if (!authorized || !user) {
    return jsonError(
      "Unauthorized",
      401
    );
  }

  try {
    const body =
      await request.json();

    const type =
      cleanText(body.type, 40);

    if (!type) {
      return jsonError(
        "Tipe perubahan wajib diisi.",
        400
      );
    }

    /*
     * UPDATE DESIGN RATE
     */

    if (
      type ===
      "design_setting"
    ) {
      const id =
        cleanText(body.id, 100);

      const rate =
        numberValue(
          body.rate_per_m2,
          -1
        );

      if (!id) {
        return jsonError(
          "ID paket tidak valid.",
          400
        );
      }

      if (
        !Number.isFinite(rate) ||
        rate < 0
      ) {
        return jsonError(
          "Tarif tidak valid.",
          400
        );
      }

      const { data: before, error: beforeError } =
        await supabase
          .from("estimator_settings")
          .select("*")
          .eq("id", id)
          .single();

      if (beforeError || !before) {
        return jsonError(
          "Paket desain tidak ditemukan.",
          404
        );
      }

      const { data, error } =
        await supabase
          .from("estimator_settings")
          .update({
            rate_per_m2:
              Math.round(rate),
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id)
          .select("*")
          .single();

      if (error) {
        console.error(
          "[ESTIMATOR DESIGN UPDATE]",
          error
        );

        return jsonError(
          "Gagal mengubah tarif paket.",
          400
        );
      }

      await supabase
        .from("audit_logs")
        .insert({
          actor_id: user.id,
          action:
            "estimator.design_rate.update",
          entity_type:
            "estimator_setting",
          entity_id: id,
          details: {
            design_level:
              before.design_level,

            old_rate:
              before.rate_per_m2,

            new_rate:
              data.rate_per_m2,
          },
        });

      return NextResponse.json({
        setting: data,
      });
    }

    /*
     * UPDATE PROJECT MULTIPLIER
     */

    if (
      type ===
      "project_type"
    ) {
      const id =
        cleanText(body.id, 100);

      const multiplier =
        numberValue(
          body.multiplier,
          -1
        );

      if (!id) {
        return jsonError(
          "ID jenis proyek tidak valid.",
          400
        );
      }

      if (
        !Number.isFinite(
          multiplier
        ) ||
        multiplier <= 0
      ) {
        return jsonError(
          "Multiplier harus lebih besar dari 0.",
          400
        );
      }

      const { data: before, error: beforeError } =
        await supabase
          .from(
            "estimator_project_types"
          )
          .select("*")
          .eq("id", id)
          .single();

      if (beforeError || !before) {
        return jsonError(
          "Jenis proyek tidak ditemukan.",
          404
        );
      }

      const { data, error } =
        await supabase
          .from(
            "estimator_project_types"
          )
          .update({
            multiplier,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id)
          .select("*")
          .single();

      if (error) {
        console.error(
          "[ESTIMATOR PROJECT UPDATE]",
          error
        );

        return jsonError(
          "Gagal mengubah multiplier.",
          400
        );
      }

      await supabase
        .from("audit_logs")
        .insert({
          actor_id: user.id,
          action:
            "estimator.project_multiplier.update",
          entity_type:
            "estimator_project_type",
          entity_id: id,
          details: {
            project_type:
              before.project_type,

            old_multiplier:
              before.multiplier,

            new_multiplier:
              data.multiplier,
          },
        });

      return NextResponse.json({
        projectType: data,
      });
    }

    /*
     * UPDATE GLOBAL CONFIG
     */

    if (
      type ===
      "global_config"
    ) {
      const minArea =
        numberValue(
          body.min_area,
          -1
        );

      const minRange =
        numberValue(
          body.min_range_percent,
          -1
        );

      const maxRange =
        numberValue(
          body.max_range_percent,
          -1
        );

      if (
        minArea < 1
      ) {
        return jsonError(
          "Minimum luas tidak valid.",
          400
        );
      }

      if (
        minRange <= 0 ||
        maxRange <= 0
      ) {
        return jsonError(
          "Range estimasi tidak valid.",
          400
        );
      }

      if (
        minRange >= maxRange
      ) {
        return jsonError(
          "Range minimum harus lebih kecil dari range maksimum.",
          400
        );
      }

      const { data: existing } =
        await supabase
          .from(
            "estimator_config"
          )
          .select("*")
          .limit(1)
          .maybeSingle();

      let data;
      let error;

      if (existing) {
        const result =
          await supabase
            .from(
              "estimator_config"
            )
            .update({
              min_area:
                minArea,

              min_range_percent:
                minRange,

              max_range_percent:
                maxRange,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              existing.id
            )
            .select("*")
            .single();

        data = result.data;
        error = result.error;
      } else {
        const result =
          await supabase
            .from(
              "estimator_config"
            )
            .insert({
              min_area:
                minArea,

              min_range_percent:
                minRange,

              max_range_percent:
                maxRange,
            })
            .select("*")
            .single();

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error(
          "[ESTIMATOR CONFIG UPDATE]",
          error
        );

        return jsonError(
          "Gagal menyimpan konfigurasi.",
          400
        );
      }

      await supabase
        .from("audit_logs")
        .insert({
          actor_id: user.id,
          action:
            "estimator.config.update",
          entity_type:
            "estimator_config",
          entity_id:
            data.id,
          details: {
            old: existing
              ? {
                  min_area:
                    existing.min_area,

                  min_range_percent:
                    existing.min_range_percent,

                  max_range_percent:
                    existing.max_range_percent,
                }
              : null,

            new: {
              min_area:
                data.min_area,

              min_range_percent:
                data.min_range_percent,

              max_range_percent:
                data.max_range_percent,
            },
          },
        });

      return NextResponse.json({
        config: data,
      });
    }

    return jsonError(
      "Tipe perubahan tidak dikenal.",
      400
    );
  } catch (error) {
    console.error(
      "[ADMIN ESTIMATOR PATCH]",
      error
    );

    return jsonError(
      "Request tidak valid.",
      400
    );
  }
}