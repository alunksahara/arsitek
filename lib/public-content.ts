import { createServerSupabase } from "@/lib/supabase-server";

export type PublicLocation = {
  id?: string;
  city: string;
  slug: string;
  province: string;
  seo_title: string;
  seo_description: string;
  h1: string;
  intro: string;
  local_context: string;
  services: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
  published: boolean;
  sort_order: number;
};

const LOCATION_FIELDS =
  "id,city,slug,province,seo_title,seo_description,h1,intro,local_context,services,process,faqs,published,sort_order";

export async function getPublishedLocations(): Promise<PublicLocation[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("locations")
    .select(LOCATION_FIELDS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("city", { ascending: true });

  if (error) {
    console.error("[PUBLIC LOCATIONS]", error);
    return [];
  }

  return (data || []) as PublicLocation[];
}

export async function getPublishedLocation(
  slug: string
): Promise<PublicLocation | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("locations")
    .select(LOCATION_FIELDS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[PUBLIC LOCATION]", error);
    return null;
  }

  return (data as PublicLocation | null) || null;
}
