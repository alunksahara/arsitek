import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedLocation } from "@/lib/public-content";
import { findService } from "@/lib/services";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ kota: string }> }) {
  const { kota } = await params;
  const location = await getPublishedLocation(kota);

  if (!location) {
    return { title: "Lokasi Tidak Ditemukan | RUMAH ARSITEK" };
  }

  return {
    title: location.seo_title,
    description: location.seo_description,
    alternates: { canonical: `/lokasi/${location.slug}` },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ kota: string }> }) {
  const { kota } = await params;
  const location = await getPublishedLocation(kota);

  if (!location) notFound();

  const services = Array.isArray(location.services) ? location.services : [];
  const process = Array.isArray(location.process) ? location.process : [];
  const faqs = Array.isArray(location.faqs) ? location.faqs : [];
  const matchedServices = services
    .map((service) => findService(service))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const uniqueServices = Array.from(new Map(matchedServices.map((service) => [service.slug, service])).values());

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25342b]">
      <header className="sticky top-0 z-40 border-b border-[#e6e9e3] bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="RUMAH ARSITEK beranda">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#2f6b4a] text-sm font-black text-white">RA</span>
            <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-bold sm:gap-7" aria-label="Navigasi lokasi">
            <Link href="/" className="text-[#3f4c44] hover:text-[#2f6b4a]">Beranda</Link>
            <Link href="/services" className="text-[#3f4c44] hover:text-[#2f6b4a]">Layanan</Link>
            <Link href="/lokasi" className="text-[#2f6b4a]">Lokasi</Link>
            <Link href="/projects" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Inspirasi</Link>
            <Link href="/#contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Konsultasi</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dce5dd] bg-[#eaf3e9]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-20 sm:py-28">
          <Link href="/lokasi" className="text-xs font-black uppercase tracking-[.15em] text-[#2f6b4a]">← Semua lokasi</Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[.16em] text-[#4b554f]">{location.province}</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] sm:text-7xl">{location.h1}</h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-[#3f4c44] sm:text-lg">{location.intro}</p>
          {location.local_context && (
            <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-[#4b554f]">{location.local_context}</p>
          )}
          {services.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {services.map((service: string) => {
                const matched = findService(service);
                return matched ? (
                  <Link key={service} href={`#${matched.slug}`} className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-[#3f4c44] ring-1 ring-[#d5e3d5] hover:bg-white">{matched.shortLabel}</Link>
                ) : (
                  <span key={service} className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-[#3f4c44] ring-1 ring-[#d5e3d5]">{service}</span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {uniqueServices.length > 0 && (
        <section className="border-b border-[#dce5dd] bg-white py-16 sm:py-24">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Layanan di {location.city}</p>
              <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Pilih titik awal yang paling dekat dengan kebutuhan Anda.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {uniqueServices.map((service) => (
                <article id={service.slug} key={service.slug} className="scroll-mt-24 rounded-3xl border border-[#d8e0d9] bg-[#fbfaf6] p-7">
                  <h3 className="font-serif text-3xl font-normal text-[#25342b]">{service.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#3f4c44]">{service.description}</p>
                  <Link href={`/services#${service.slug}`} className="mt-5 inline-flex text-sm font-black text-[#2f6b4a]">Pelajari layanan →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 py-16 sm:py-24 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Cara mulai</p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Mulai dari kebutuhan Anda.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {process.map((step: string, index: number) => (
              <article key={`${step}-${index}`} className="rounded-3xl border border-[#d8e0d9] bg-white p-6 shadow-sm">
                <span className="text-xs font-black text-[#2f6b4a]">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-6 text-base font-bold leading-7 text-[#25342b]">{step}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="border-y border-[#dce5dd] bg-white">
          <div className="mx-auto w-[min(900px,calc(100%-32px))] py-16 sm:py-24">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Pertanyaan umum</p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Sebelum mulai, mungkin ini yang ingin Anda tahu.</h2>
            <div className="mt-10 divide-y divide-[#e1e6e1]">
              {faqs.map((faq: { question: string; answer: string }, index: number) => (
                <details key={`${faq.question}-${index}`} className="py-5">
                  <summary className="cursor-pointer list-none pr-8 text-base font-bold text-[#25342b]">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-[#3f4c44]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#765b40]">{location.city}</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-normal tracking-[-.03em]">Punya rencana ruang di {location.city}? Cerita saja.</h2>
          </div>
          <Link href="/#contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#173d29]">Ceritakan rencana saya →</Link>
        </div>
      </section>
    </main>
  );
}
