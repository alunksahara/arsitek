"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const services = [
  ["Rumah Baru", "/services#rumah-baru"],
  ["Renovasi", "/services#renovasi"],
  ["Interior", "/services#interior"],
  ["Ruang Usaha", "/services#ruang-usaha"],
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[#26362d] bg-[#17211c] text-white">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="RUMAH ARSITEK beranda">
              <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#3f7b58] text-sm font-black text-white">RA</span>
              <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Memahami kebutuhan ruang, memberi gambaran awal, lalu membantu menemukan jalan menuju partner profesional yang sesuai.
            </p>
            <p className="mt-5 max-w-sm text-xs leading-6 text-white/35">
              Dibangun untuk berkembang lintas kota melalui ekosistem tenaga profesional dan partner proyek.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[.18em] text-white/80">Perusahaan</h2>
            <nav className="mt-5 grid gap-3 text-sm text-white/55" aria-label="Navigasi perusahaan">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <Link href="/projects" className="hover:text-white">Portfolio / Inspirasi</Link>
              <Link href="/services" className="hover:text-white">Layanan</Link>
              <Link href="/lokasi" className="hover:text-white">Area layanan</Link>
              <Link href="/karier" className="hover:text-white">Karier & Partner</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[.18em] text-white/80">Layanan</h2>
            <nav className="mt-5 grid gap-3 text-sm text-white/55" aria-label="Layanan utama">
              {services.map(([label, href]) => (
                <Link key={label} href={href} className="hover:text-white">{label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[.18em] text-white/80">Mulai dari sini</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">Belum tahu harus mulai dari mana? Ceritakan kebutuhan Anda terlebih dahulu.</p>
            <Link href="/contact" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-[#244734] transition hover:-translate-y-0.5">
              Konsultasi →
            </Link>
            <Link href="/karier" className="mt-3 block text-xs font-bold text-white/45 hover:text-white">Ingin bergabung? Lihat Karier →</Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RUMAH ARSITEK. All rights reserved.</p>
          <p>Partner mewujudkan ruang.</p>
        </div>
      </div>
    </footer>
  );
}
