import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { requireStaff } from "@/lib/admin";
import { jsonError } from "@/lib/security";

function cleanString(value: unknown, max = 500) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  if (!result) return null;
  return result.slice(0, max);
}

function cleanSlug(value: unknown) {
  if (typeof value !== "string") return null;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
  return slug || null;
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export async function GET() {
  try {
    const { authorized, supabase } = await requireStaff();

    if (authorized) {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) return jsonError("Gagal mengambil portfolio.", 500);

      return NextResponse.json(
        { projects: data || [] },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const publicSupabase = await createServerSupabase();
    const { data, error } = await publicSupabase
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) return jsonError("Gagal mengambil portfolio.", 500);

    return NextResponse.json({ projects: data || [] });
  } catch (error) {
    console.error("[PORTFOLIO GET FATAL]", error);
    return jsonError("Terjadi kesalahan server.", 500);
  }
}

export async function POST(request: Request) {
  const { authorized, supabase, user, role } = await requireStaff();

  if (!authorized || !user) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonError("Format request tidak valid.", 400);
    }

    const title = cleanString(body.title, 160);
    const slug = cleanSlug(body.slug);
    const imageUrl = cleanString(body.image_url, 1000);

    if (!title || !slug || !imageUrl) {
      return jsonError("Title, slug, dan image wajib diisi.", 400);
    }

    const location = cleanString(body.location, 200);
    const category = cleanString(body.category, 120);
    const description = cleanString(body.description, 5000);
    const featured = normalizeBoolean(body.featured, false);
    const published = normalizeBoolean(body.published, true);
    const rawSortOrder = body.sort_order === undefined ? 0 : Number(body.sort_order);

    if (!Number.isFinite(rawSortOrder)) {
      return jsonError("Sort order tidak valid.", 400);
    }

    const sortOrder = Math.max(0, Math.trunc(rawSortOrder));

    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({
        title,
        slug,
        location,
        category,
        image_url: imageUrl,
        description,
        featured,
        published,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return jsonError("Slug portfolio sudah digunakan.", 409);
      }

      console.error("[PORTFOLIO CREATE]", error);
      return jsonError("Gagal membuat portfolio.", 400);
    }

    await writeAudit(user.id, "portfolio.create", data.id, {
      title: data.title,
      slug: data.slug,
      role,
    });

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    console.error("[PORTFOLIO CREATE FATAL]", error);
    return jsonError("Request tidak valid.", 400);
  }
}

async function writeAudit(
  actorId: string,
  action: string,
  entityId: string,
  details: unknown
) {
  const auditSupabase = createAdminSupabase();

  const { error } = await auditSupabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: "portfolio",
    entity_id: entityId,
    details,
  });

  if (error) {
    console.error("[PORTFOLIO AUDIT]", error);
  }
}
