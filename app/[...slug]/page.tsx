import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedLocation } from "@/lib/public-content";

export default async function LegacyLocationRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const location = await getPublishedLocation(slug);

  if (!location) notFound();

  permanentRedirect(`/lokasi/${location.slug}`);
}
