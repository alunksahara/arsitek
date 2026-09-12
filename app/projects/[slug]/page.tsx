import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { getPublishedLocations } from "@/lib/public-content";
import { getPortfolioLocationLabel, resolvePortfolioRelations } from "@/lib/portfolio";

type P = {
  title: string;
  slug: string;
  location: string | null;
  category: string | null;
  image_url: string;
  description: string | null;
};

async function getProject(slug: string) {
  const s = await createServerSupabase();
  const { data } = await s
    .from("portfolio_projects")
    .select("title,slug,location,category,image_url,description")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as P | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description || `${p.title} — project by RUMAH ARSITEK`,
    openGraph: {
      title: p.title,
      description: p.description || "Architecture, interior & exterior by RUMAH ARSITEK",
      images: [p.image_url],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, locations] = await Promise.all([getProject(slug), getPublishedLocations()]);
  if (!p) notFound();

  const relation = resolvePortfolioRelations(p, locations);
  const locationLabel = getPortfolioLocationLabel(p, relation.location);

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#25342b]">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-8 sm:py-12">
        <Link href="/projects#projects" className="text-xs font-black uppercase tracking-[.18em] text-[#3f4c44] hover:text-[#2f6b4a]">
          ← Kembali ke portfolio
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[.18em]">
              {relation.service ? (
                <Link href={`/services#${relation.service.slug}`} className="text-[#2f6b4a] hover:underline">
                  {relation.service.label}
                </Link>
              ) : p.category ? (
                <span className="text-[#77736c]">{p.category}</span>
              ) : null}
              {locationLabel && <span className="text-[#a19d95]">·</span>}
              {relation.location ? (
                <Link href={`/lokasi/${relation.location.slug}`} className="text-[#77736c] hover:text-[#2f6b4a] hover:underline">
                  {locationLabel}
                </Link>
              ) : locationLabel ? (
                <span className="text-[#77736c]">{locationLabel}</span>
              ) : null}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-none md:text-8xl">{p.title}</h1>
          </div>
          <p className="text-sm leading-7 text-[#77736c]">{p.description}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] bg-white p-2 shadow-sm">
          <Image src={p.image_url} alt={p.title} width={1800} height={1200} priority sizes="100vw" className="max-h-[75vh] w-full rounded-[22px] object-cover" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {relation.service && (
            <Link href={`/services#${relation.service.slug}`} className="rounded-full border border-[#cfd8d0] bg-white px-5 py-3 text-sm font-bold hover:border-[#2f6b4a] hover:text-[#2f6b4a]">
              Lihat layanan {relation.service.label} →
            </Link>
          )}
          {relation.location && (
            <Link href={`/lokasi/${relation.location.slug}`} className="rounded-full border border-[#cfd8d0] bg-white px-5 py-3 text-sm font-bold hover:border-[#2f6b4a] hover:text-[#2f6b4a]">
              Lihat layanan di {relation.location.city} →
            </Link>
          )}
          <Link href="/#estimasi" className="rounded-full bg-[#2f6b4a] px-5 py-3 text-sm font-bold text-white hover:bg-[#173d29]">
            Coba estimasi →
          </Link>
        </div>
      </div>
    </main>
  );
}
