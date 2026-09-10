import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("portfolio_projects").select("slug,updated_at").eq("published", true);
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...(data || []).map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.updated_at) })),
  ];
}
