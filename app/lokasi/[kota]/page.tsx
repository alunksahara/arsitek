import Link from "next/link";
import { notFound } from "next/navigation";

const locations: Record<string, { name: string; region: string; intro: string; localNeeds: string[] }> = {
  kediri: {
    name: "Kediri",
    region: "Jawa Timur",
    intro: "RUMAH ARSITEK Kediri membantu Anda memulai kebutuhan ruang dari cerita, kondisi, dan tujuan proyek—sebelum diarahkan menuju partner profesional yang sesuai.",
    localNeeds: ["Desain rumah baru", "Renovasi rumah", "Desain interior", "Ruang usaha, kos, villa, dan guest house"],
  },
  jombang: {
    name: "Jombang",
    region: "Jawa Timur",
    intro: "Untuk kebutuhan rumah, renovasi, interior, atau ruang usaha di Jombang, percakapan dapat dimulai dari kebutuhan nyata tanpa harus sudah memiliki gambar desain.",
    localNeeds: ["Desain rumah baru", "Renovasi rumah", "Desain interior", "Ruang usaha dan properti"],
  },
  malang: {
    name: "Malang",
    region: "Jawa Timur",
    intro: "Kebutuhan ruang di Malang dapat dimulai dari cerita tentang lahan, aktivitas, karakter bangunan, dan tujuan proyek sebelum menentukan langkah desain yang tepat.",
    localNeeds: ["Desain rumah baru", "Renovasi rumah", "Desain interior", "Villa, usaha, dan properti komersial"],
  },
  surabaya: {
    name: "Surabaya",
    region: "Jawa Timur",
    intro: "RUMAH ARSITEK Surabaya menjadi pintu awal untuk kebutuhan hunian maupun ruang usaha yang membutuhkan perencanaan lebih terarah dan partner profesional yang sesuai.",
    localNeeds: ["Desain rumah baru", "Renovasi rumah", "Desain interior", "Kantor, toko, café, dan ruang usaha"],
  },
  mojokerto: {
    name: "Mojokerto",
    region: "Jawa Timur",
    intro: "Mulai dari kebutuhan ruang yang Anda ceritakan. RUMAH ARSITEK Mojokerto membantu memetakan kebutuhan sebelum Anda masuk ke tahap desain dan pembahasan teknis.",
    localNeeds: ["Desain rumah baru", "Renovasi rumah", "Desain interior", "Kos, villa, dan ruang usaha"],
  },
};

export function generateStaticParams() {
  return Object.keys(locations).map((kota) => ({ kota }));
}

export async function generateMetadata({ params }: { params: Promise<{ kota: string }> }) {
  const { kota } = await params;
  const location = locations[kota];
  if (!location) return {};
  return {
    title: `RUMAH ARSITEK ${location.name} | Desain, Renovasi & Interior`,
    description: `${location.intro} Jelajahi kebutuhan desain rumah, renovasi, interior, dan ruang usaha di ${location.name}.`,
    alternates: { canonical: `/lokasi/${kota}` },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ kota: string }> }) {
  const { kota } = await params;
  const location = locations[kota];
  if (!location) notFound();

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25342b]">
      <header className="sticky top-0 z-40 border-b border-[#e6e9e3] bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="RUMAH ARSITEK beranda">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#2f6b4a] text-sm font-black text-white">RA</span>
            <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-bold sm:gap-7">
            <Link href="/" className="text-[#3f4c44] hover:text-[#2f6b4a]">Beranda</Link>
            <Link href="/lokasi" className="text-[#2f6b4a]">Lokasi</Link>
            <Link href="/projects" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Inspirasi</Link>
            <Link href="/#contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Konsultasi</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dce5dd] bg-[#eaf3e9]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-20 sm:py-28">
          <Link href="/lokasi" className="text-xs font-black uppercase tracking-[.15em] text-[#2f6b4a]">← Semua lokasi</Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[.16em] text-[#6a766f]">{location.region}</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] sm:text-7xl">RUMAH ARSITEK <span className="text-[#2f6b4a]">{location.name}</span></h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-[#3f4c44] sm:text-lg">{location.intro}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {location.localNeeds.map((need) => <span key={need} className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-[#3f4c44] ring-1 ring-[#d5e3d5]">{need}</span>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 py-16 sm:py-24 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Cara mulai</p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Tidak perlu datang dengan gambar.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[["01", "Cerita", "Ceritakan kebutuhan, kondisi, aktivitas, dan tujuan ruang Anda."], ["02", "Pahami", "Kebutuhan dipetakan agar arah desain dan layanan lebih jelas."], ["03", "Hubungkan", "Anda diarahkan menuju partner profesional yang sesuai kebutuhan proyek."]].map(([no, title, text]) => (
            <article key={no} className="rounded-3xl border border-[#d8e0d9] bg-white p-6 shadow-sm">
              <span className="text-xs font-black text-[#2f6b4a]">{no}</span>
              <h3 className="mt-10 font-serif text-2xl font-normal">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#3f4c44]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#765b40]">{location.name}</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-normal tracking-[-.03em]">Punya rencana ruang di {location.name}? Cerita saja.</h2>
          </div>
          <Link href="/#contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#173d29]">Ceritakan rencana saya →</Link>
        </div>
      </section>
    </main>
  );
}
