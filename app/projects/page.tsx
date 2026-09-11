import Link from "next/link";

const projects = [
  {
    title: "Rumah dengan cahaya alami",
    category: "Rumah",
    description: "Inspirasi rumah yang menempatkan cahaya, sirkulasi, dan kenyamanan keluarga sebagai bagian dari pengalaman ruang.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=88",
  },
  {
    title: "Renovasi ruang keluarga",
    category: "Renovasi",
    description: "Contoh pendekatan renovasi yang berangkat dari masalah ruang dan kebutuhan aktivitas sehari-hari.",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=88",
  },
  {
    title: "Interior yang terasa personal",
    category: "Interior",
    description: "Inspirasi interior yang mengutamakan fungsi, penyimpanan, material, dan karakter penghuni.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=88",
  },
  {
    title: "Ruang usaha yang bekerja",
    category: "Ruang Usaha",
    description: "Ruang komersial perlu menarik sekaligus membantu alur pengguna dan aktivitas bisnis berjalan lebih baik.",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=88",
  },
];

export const metadata = {
  title: "Inspirasi Rumah, Renovasi & Interior | RUMAH ARSITEK",
  description: "Jelajahi inspirasi desain rumah, renovasi, interior, dan ruang usaha dari RUMAH ARSITEK.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
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
            <Link href="/#contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Konsultasi</Link>
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

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] py-16 sm:py-24">
        <div className="grid gap-7 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className="group overflow-hidden rounded-[30px] border border-[#d8e0d9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="overflow-hidden p-2">
                <img src={project.image} alt={project.title} className="h-[300px] w-full rounded-[23px] object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[390px]" />
              </div>
              <div className="p-7 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[.14em] text-[#2f6b4a]">{project.category}</p>
                <h2 className="mt-3 font-serif text-3xl font-normal tracking-[-.03em]">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#3f4c44]">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#765b40]">Punya kebutuhan sendiri?</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-normal tracking-[-.03em]">Inspirasi boleh dari sini. Keputusan tetap berdasarkan ruang Anda.</h2>
          </div>
          <Link href="/#contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#173d29]">Ceritakan rencana saya →</Link>
        </div>
      </section>
    </main>
  );
}
