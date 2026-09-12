import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://arsitek-rose.vercel.app"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase();

  const [{ data: locations }, { data: projects }] = await Promise.all([
    supabase
      .from("locations")
      .select("slug,updated_at")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("portfolio_projects")
      .select("slug,updated_at")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/services`, lastModified: now },
    { url: `${SITE_URL}/lokasi`, lastModified: now },
    { url: `${SITE_URL}/projects`, lastModified: now },
    { url: `${SITE_URL}/contact`, lastModified: now },
    ...(locations || []).map((location) => ({
      url: `${SITE_URL}/lokasi/${location.slug}`,
      lastModified: location.updated_at
        ? new Date(location.updated_at)
        : now,
    })),
    ...(projects || []).map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at)
        : now,
    })),
  ];
}
