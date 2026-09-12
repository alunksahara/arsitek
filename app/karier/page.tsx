import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Karier & Partner Profesional",
  description:
    "Bergabung dengan ekosistem RUMAH ARSITEK sebagai arsitek, desainer, drafter, visualizer, project coordinator, atau partner profesional.",
  alternates: { canonical: "/karier" },
};

const roles = [
  {
    title: "Arsitek",
    text: "Membantu menerjemahkan kebutuhan klien menjadi konsep dan solusi arsitektur yang matang.",
  },
  {
    title: "Interior Designer",
    text: "Mengembangkan pengalaman ruang yang nyaman, fungsional, dan sesuai karakter pengguna.",
  },
  {
    title: "Drafter & 3D Visualizer",
    text: "Membantu mengubah konsep menjadi gambar kerja dan visual yang mudah dipahami.",
  },
  {
    title: "Project Coordinator",
    text: "Menjaga komunikasi, alur pekerjaan, dan koordinasi antara kebutuhan klien dan partner profesional.",
  },
  {
    title: "Partner Profesional",
    text: "Terbuka untuk tenaga ahli dan studio lokal yang ingin berkolaborasi berdasarkan kebutuhan proyek.",
  },
];

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25342b]">
      <header className="border-b border-[#e6e9e3] bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3" aria-label="RUMAH ARSITEK beranda">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#2f6b4a] text-sm font-black text-white">RA</span>
            <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-bold sm:gap-7" aria-label="Navigasi karier">
            <Link href="/" className="text-[#3f4c44] hover:text-[#2f6b4a]">Beranda</Link>
            <Link href="/projects" className="hidden text-[#3f4c44] hover:text-[#2f6b4a] sm:inline">Inspirasi</Link>
            <Link href="/contact" className="rounded-full bg-[#2f6b4a] px-4 py-2.5 text-white hover:bg-[#173d29]">Hubungi kami</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#dce5dd] bg-[#eaf3e9]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-20 sm:py-28">
          <p className="mb-5 text-xs font-black uppercase tracking-[.18em] text-[#2f6b4a]">Karier & kolaborasi</p>
          <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[1.02] tracking-[-.045em] sm:text-7xl">
            Membangun ruang bersama <span className="text-[#2f6b4a]">orang yang tepat.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#3f4c44] sm:text-lg">
            RUMAH ARSITEK disiapkan untuk tumbuh sebagai ekosistem yang mempertemukan kebutuhan klien dengan tenaga profesional yang sesuai. Karena itu, kami terbuka terhadap talenta, tenaga ahli, studio lokal, dan partner proyek yang memiliki cara kerja profesional.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact?topic=karier" className="rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white shadow-lg hover:bg-[#255a3e]">Kirim CV / portofolio →</Link>
            <Link href="/projects" className="rounded-full bg-white px-6 py-4 text-sm font-black text-[#2f6b4a] ring-1 ring-[#d8e4d8] hover:bg-[#f7faf7]">Lihat proyek</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#2f6b4a]">Peran yang terbuka</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl font-normal tracking-[-.035em] sm:text-5xl">Tidak selalu harus menjadi karyawan.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <article key={role.title} className="rounded-[24px] border border-[#d8e0d9] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#2f6b4a]">{role.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f6b64]">{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce5dd] bg-[#f3eee5]">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 py-16 sm:py-20 lg:grid-cols-3">
          {[
            ["01", "Profesional", "Kami menghargai kualitas kerja, komunikasi yang jelas, dan tanggung jawab terhadap proyek."],
            ["02", "Kolaboratif", "Proyek dapat melibatkan partner berbeda sesuai kebutuhan, lokasi, dan keahlian yang diperlukan."],
            ["03", "Berkembang", "RUMAH ARSITEK dirancang untuk berkembang lintas kota, sehingga peluang kolaborasi tidak harus terbatas pada satu wilayah."],
          ].map(([no, title, text]) => (
            <div key={no}>
              <span className="text-[10px] font-black tracking-[.18em] text-[#8a765e]">{no}</span>
              <h3 className="mt-3 font-serif text-3xl font-normal">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#655e54]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(900px,calc(100%-32px))] py-20 text-center sm:py-28">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#2f6b4a]">Belum ada lowongan spesifik?</p>
        <h2 className="mt-4 font-serif text-4xl font-normal tracking-[-.035em] sm:text-6xl">Tetap boleh memperkenalkan diri.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#66726b]">
          Kami tidak ingin membuat klaim lowongan yang belum tersedia. Jika Anda merasa bisa memberi nilai bagi RUMAH ARSITEK, kirimkan profil singkat beserta CV atau portofolio untuk dipertimbangkan ketika kebutuhan yang sesuai muncul.
        </p>
        <Link href="/contact?topic=karier" className="mt-8 inline-flex rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-black text-white shadow-lg hover:bg-[#255a3e]">Perkenalkan diri →</Link>
      </section>
    </main>
  );
}
