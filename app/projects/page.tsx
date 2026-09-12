import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { getPublishedLocations } from "@/lib/public-content";
import { getPortfolioLocationLabel, resolvePortfolioRelations } from "@/lib/portfolio";

export const revalidate = 60;

export const metadata = {
  title: "Inspirasi Rumah, Renovasi & Interior | RUMAH ARSITEK",
  description:
    "Jelajahi inspirasi desain rumah, renovasi, interior, dan ruang usaha dari RUMAH ARSITEK.",
  alternates: { canonical: "/projects" },
};

type Project = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  category: string | null;
  image_url: string;
  description: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

async function getProjects(): Promise<Project[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(
      "id,title,slug,location,category,image_url,description,featured,published,sort_order"
    )
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[PUBLIC PORTFOLIO]", error);
    return [];
  }

  return (data || []) as Project[];
}

export default async function ProjectsPage() {
  const [projects, locations] = await Promise.all([
    getProjects(),
    getPublishedLocations(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25342b]">
      <header className="sticky top-0 z-40 border-b border-[#e6e9e3] bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="RUMAH ARSITEK beranda">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#2f6b4a] text-sm font-black text-white">RA</span>
            <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-bold sm:gap-7" aria-label="Navigasi inspirasi">
            <Link href="/" className="text-[#3f4c44] hover:text-[#2f6b4a]">Beranda</Link>
            <Link href="/lokasi" className="text-[#3f4c44] hover:text-[#2f6b4a]">Lokasi</Link>
            <Link href="/#estimasi" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Estimasi</Link>
            <Link href="/contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Konsultasi</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dce5dd] bg-[#eaf3e9]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-20 sm:py-28">
          <p className="mb-4 text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Inspirasi RUMAH ARSITEK</p>
          <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] sm:text-7xl">Lihat ruangnya. <span className="text-[#2f6b4a]">Bayangkan cerita Anda.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#3f4c44] sm:text-lg">Inspirasi bukan untuk meniru. Gunakan sebagai titik awal untuk menemukan apa yang Anda suka, apa yang Anda butuhkan, dan apa yang ingin Anda ubah.</p>
        </div>
      </section>

      <section id="projects" className="mx-auto w-[min(1180px,calc(100%-32px))] py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Portfolio terpilih</p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Ruang yang lahir dari kebutuhan yang berbeda.</h2>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-[#d8e0d9] bg-white p-8 text-[#3f4c44] shadow-sm">
            Portfolio sedang disiapkan. Untuk kebutuhan desain, renovasi, interior, atau ruang usaha, Anda tetap bisa memulai dengan konsultasi.
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2">
            {projects.map((project) => {
              const relation = resolvePortfolioRelations(project, locations);
              const locationLabel = getPortfolioLocationLabel(project, relation.location);

              return (
                <article key={project.id} className="group overflow-hidden rounded-[30px] border border-[#d8e0d9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <Link href={`/projects/${project.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-[#2f6b4a] focus:ring-offset-2">
                    <div className="overflow-hidden p-2">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        loading="lazy"
                        className="h-[300px] w-full rounded-[23px] object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[390px]"
                      />
                    </div>
                    <div className="p-7 pb-4 sm:p-8 sm:pb-5">
                      <h2 className="font-serif text-3xl font-normal tracking-[-.03em]">{project.title}</h2>
                      {project.description && (
                        <p className="mt-3 text-sm leading-7 text-[#3f4c44]">{project.description}</p>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 px-7 pb-7 text-xs font-black uppercase tracking-[.14em] sm:px-8 sm:pb-8">
                    {relation.service ? (
                      <Link href={`/services#${relation.service.slug}`} className="text-[#2f6b4a] hover:underline">
                        {relation.service.label}
                      </Link>
                    ) : project.category ? (
                      <span className="text-[#2f6b4a]">{project.category}</span>
                    ) : null}
                    {locationLabel && <span className="text-[#6a766f]">·</span>}
                    {relation.location ? (
                      <Link href={`/lokasi/${relation.location.slug}`} className="text-[#6a766f] hover:text-[#2f6b4a] hover:underline">
                        {locationLabel}
                      </Link>
                    ) : locationLabel ? (
                      <span className="text-[#6a766f]">{locationLabel}</span>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#765b40]">Punya kebutuhan sendiri?</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-normal tracking-[-.03em]">Inspirasi boleh dari sini. Keputusan tetap berdasarkan ruang Anda.</h2>
          </div>
          <Link href="/contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#173d29]">Ceritakan rencana saya →</Link>
        </div>
      </section>
    </main>
  );
}
