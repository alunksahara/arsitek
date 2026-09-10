import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationLanding, { type LocationData } from "@/components/LocationLanding";
import { createServerSupabase } from "@/lib/supabase-server";

async function getLocation(slug: string): Promise<LocationData | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("locations")
    .select("city,slug,province,seo_title,seo_description,h1,intro,local_context,services,process,faqs")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return null;
  return data as LocationData;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: parts } = await params;
  const location = await getLocation(parts.join("/"));
  if (!location) return {};

  return {
    title: location.seoTitle,
    description: location.seoDescription,
    alternates: { canonical: `/${location.slug}` },
  };
}

export default async function CmsLocationPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: parts } = await params;
  const location = await getLocation(parts.join("/"));
  if (!location) notFound();
  return <LocationLanding location={location} />;
}
