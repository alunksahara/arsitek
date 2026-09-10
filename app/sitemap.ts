import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
      .eq("published", true),
  ]);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...(locations || []).map((location) => ({
      url: `${base}/${location.slug}`,
      lastModified: new Date(location.updated_at),
    })),
    ...(projects || []).map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
    })),
  ];
}
