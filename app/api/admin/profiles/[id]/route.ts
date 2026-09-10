import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/security";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: Context
) {
  const {
    authorized,
    supabase,
    user,
  } = await requireAdmin();

  if (!authorized || !user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;

  try {
    const body = await request.json();

    if (
      id === user.id &&
      body.active === false
    ) {
      return jsonError(
        "Akun admin yang sedang digunakan tidak boleh dinonaktifkan.",
        400
      );
    }

    const patch: Record<string, unknown> = {};

    if ("role" in body) {
      if (
        body.role !== "admin" &&
        body.role !== "editor"
      ) {
        return jsonError(
          "Role harus admin atau editor.",
          400
        );
      }

      patch.role = body.role;
    }

    if ("active" in body) {
      if (typeof body.active !== "boolean") {
        return jsonError(
          "Active harus boolean.",
          400
        );
      }

      patch.active = body.active;
    }

    if (!Object.keys(patch).length) {
      return jsonError(
        "Tidak ada perubahan.",
        400
      );
    }

    patch.updated_at = new Date().toISOString();

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select(
        "id,email,role,active,created_at,updated_at"
      )
      .single();

    if (error) {
      console.error("[PROFILE UPDATE]", error);

      return jsonError(
        "Gagal memperbarui anggota team.",
        400
      );
    }

    const {
      error: auditError,
    } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: user.id,
        action: "profile.update",
        entity_type: "profile",
        entity_id: id,
        details: {
          changed: Object.keys(patch),
          values: patch,
        },
      });

    if (auditError) {
      console.error(
        "[PROFILE UPDATE AUDIT]",
        auditError
      );
    }

    return NextResponse.json({
      profile: data,
    });
  } catch (error) {
    console.error(
      "[PROFILE UPDATE FATAL]",
      error
    );

    return jsonError(
      "Request tidak valid.",
      400
    );
  }
}