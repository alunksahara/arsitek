import Link from "next/link";

const locations = [
  { slug: "kediri", name: "Kediri", region: "Jawa Timur", description: "Titik awal RUMAH ARSITEK untuk kebutuhan desain rumah, renovasi, interior, dan ruang usaha." },
  { slug: "jombang", name: "Jombang", region: "Jawa Timur", description: "Informasi dan jalur konsultasi kebutuhan ruang untuk rumah, renovasi, interior, dan usaha di Jombang." },
  { slug: "malang", name: "Malang", region: "Jawa Timur", description: "Jelajahi kebutuhan desain dan pengembangan ruang untuk hunian maupun properti usaha di Malang." },
  { slug: "surabaya", name: "Surabaya", region: "Jawa Timur", description: "Ruang tinggal dan ruang usaha di Surabaya membutuhkan pendekatan yang sesuai konteks dan kebutuhan pengguna." },
  { slug: "mojokerto", name: "Mojokerto", region: "Jawa Timur", description: "Mulai dari cerita kebutuhan ruang hingga menemukan jalur profesional yang sesuai di Mojokerto." },
];

export const metadata = {
  title: "Lokasi Layanan Desain & Arsitektur",
  description: "Jelajahi halaman lokasi RUMAH ARSITEK untuk kebutuhan rumah, renovasi, interior, dan ruang usaha di berbagai kota.",
  alternates: { canonical: "/lokasi" },
};

export default function LokasiPage() {
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
            <Link href="/projects" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Inspirasi</Link>
            <Link href="/#estimasi" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Estimasi</Link>
            <Link href="/#contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Konsultasi</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dce5dd] bg-[#eaf3e9]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-20 sm:py-28">
          <p className="mb-4 text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Lokasi RUMAH ARSITEK</p>
          <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] sm:text-7xl">Mulai dari kota Anda. <span className="text-[#2f6b4a]">Ruangnya tetap personal.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#3f4c44] sm:text-lg">RUMAH ARSITEK tidak dibangun untuk berhenti di satu kota. Halaman lokasi membantu Anda menemukan konteks layanan berdasarkan wilayah, sementara kebutuhan proyek tetap menjadi titik awal percakapan.</p>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#2f6b4a]">Pilih wilayah</p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Kebutuhan ruang, dimulai dari tempat Anda berada.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link key={location.slug} href={`/lokasi/${location.slug}`} className="group rounded-3xl border border-[#d8e0d9] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#9bb5a2] hover:shadow-xl">
              <p className="text-xs font-black uppercase tracking-[.14em] text-[#6a766f]">{location.region}</p>
              <h3 className="mt-14 font-serif text-3xl font-normal text-[#25342b]">RUMAH ARSITEK {location.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#3f4c44]">{location.description}</p>
              <span className="mt-7 inline-flex text-sm font-black text-[#2f6b4a]">Jelajahi {location.name} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#765b40]">Belum menemukan kota?</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-normal tracking-[-.03em]">Tidak perlu menunggu halaman kota tersedia untuk mulai bercerita.</h2>
          </div>
          <Link href="/#contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#173d29]">Ceritakan rencana saya →</Link>
        </div>
      </section>
    </main>
  );
}
