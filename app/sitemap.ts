import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase-server";

const LOCATION_SLUGS = [
  "jasa-arsitek-kediri",
  "jasa-arsitek-nganjuk",
  "jasa-arsitek-malang",
  "jasa-arsitek-surabaya",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("portfolio_projects")
    .select("slug,updated_at")
    .eq("published", true);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    ...LOCATION_SLUGS.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
    })),
    ...(data || []).map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
    })),
  ];
}
