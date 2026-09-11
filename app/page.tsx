"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";
import TeamSection from "@/components/TeamSection";

const categories = [
  { number: "01", title: "Rumah Baru", text: "Mulai dari lahan kosong sampai konsep rumah yang terasa benar-benar milik Anda." },
  { number: "02", title: "Renovasi", text: "Ubah ruang yang ada agar lebih nyaman, rapi, fungsional, dan relevan dengan kebutuhan baru." },
  { number: "03", title: "Interior", text: "Susun suasana, layout, material, warna, dan furniture agar ruang terasa lebih hidup." },
  { number: "04", title: "Bisnis & Properti", text: "Café, kantor, toko, villa, kos, guest house, dan ruang usaha lainnya." },
];

const projects = [
  {
    title: "Tropical Courtyard",
    type: "Residential",
    location: "Kediri · Jawa Timur",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Quiet Modern House",
    type: "Residential",
    location: "Jawa Timur",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Warm Minimal Interior",
    type: "Interior",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
  },
];

const steps = [
  ["01", "Ceritakan rencana", "Kirim kebutuhan sederhana: jenis proyek, lokasi, luas, kondisi, dan gambaran yang Anda inginkan."],
  ["02", "Konsultasi awal", "Kita rapikan kebutuhan dan menentukan arah yang paling masuk akal untuk proyek Anda."],
  ["03", "Temukan solusi", "Kebutuhan diteruskan kepada partner profesional yang sesuai dengan lingkup proyek."],
  ["04", "Proyek berjalan", "Pekerjaan teknis ditangani profesional sesuai ruang lingkup dan kesepakatan proyek."],
];

function Arrow({ dark = false }: { dark?: boolean }) {
  return (
    <span className={dark ? "text-white" : "text-current"} aria-hidden="true">↗</span>
  );
}

function MenuIcon() {
  return <span className="text-2xl leading-none">☰</span>;
}

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappMessage = encodeURIComponent("Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya.");
  const whatsappUrl = useMemo(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, [whatsappNumber, whatsappMessage]);

  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#1d211d]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[76px] w-[min(1240px,calc(100%-32px))] items-center justify-between gap-6">
          <a href="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#173d29] text-lg font-serif text-white">R</span>
            <span>
              <strong className="block text-[13px] tracking-[.16em]">RUMAH ARSITEK</strong>
              <small className="hidden text-[9px] uppercase tracking-[.18em] text-black/45 sm:block">Space · Planning · Professional Network</small>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a href="#kebutuhan" className="text-xs font-semibold hover:text-[#24563b]">Kebutuhan</a>
            <a href="#inspirasi" className="text-xs font-semibold hover:text-[#24563b]">Inspirasi</a>
            <a href="#cara-kerja" className="text-xs font-semibold hover:text-[#24563b]">Cara Kerja</a>
            <a href="#estimasi" className="text-xs font-semibold hover:text-[#24563b]">Estimasi</a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#173d29]">WhatsApp</a>
            <a href="/contact" className="rounded-full bg-[#173d29] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#24563b]">Mulai Konsultasi <Arrow dark /></a>
          </div>

          <button type="button" className="rounded-full border border-black/10 p-2 lg:hidden" onClick={() => setMobileMenu((v) => !v)} aria-label="Buka menu" aria-expanded={mobileMenu}><MenuIcon /></button>
        </div>
        {mobileMenu && (
          <div className="border-t border-black/10 bg-[#f5f2eb] px-4 py-5 lg:hidden">
            {[["#kebutuhan", "Kebutuhan"], ["#inspirasi", "Inspirasi"], ["#cara-kerja", "Cara Kerja"], ["#estimasi", "Estimasi"], ["/contact", "Konsultasi"]].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileMenu(false)} className="block border-b border-black/10 py-4 text-base font-semibold">{label}</a>
            ))}
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-[#173d29] text-white">
        <div className="mx-auto grid min-h-[720px] w-[min(1240px,calc(100%-32px))] items-end gap-10 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
          <div className="relative z-10 pb-4 lg:pb-12">
            <p className="mb-7 text-[10px] font-bold uppercase tracking-[.28em] text-[#c9d8c9]">RUMAH ARSITEK · KEDIRI / INDONESIA</p>
            <h1 className="max-w-[820px] font-serif text-[clamp(52px,7.2vw,104px)] font-normal leading-[.9] tracking-[-.065em]">Ruang yang terasa <i className="text-[#d9b98c]">seperti Anda.</i></h1>
            <p className="mt-8 max-w-[600px] text-[15px] leading-7 text-white/70 sm:text-[17px]">Mulai dari kebutuhan Anda. Kami membantu menyederhanakan langkah menuju desain, renovasi, interior, dan solusi ruang bersama partner profesional yang sesuai.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#d9b98c] px-6 py-4 text-sm font-extrabold text-[#173d29] transition hover:-translate-y-1">Konsultasi via WhatsApp <Arrow /></a>
              <a href="#estimasi" className="rounded-full border border-white/30 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10">Cek estimasi awal</a>
            </div>
            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[.13em] text-white/55">
              <span>Rumah baru</span><span>Renovasi</span><span>Interior</span><span>Komersial</span>
            </div>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-[#d8d1c5] lg:h-[600px]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${projects[0].image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div><p className="text-[9px] uppercase tracking-[.22em] text-white/65">Visual direction</p><p className="mt-2 font-serif text-2xl">Tropical Courtyard</p></div>
              <span className="rounded-full border border-white/30 px-3 py-2 text-[9px] uppercase tracking-[.16em]">01 / 03</span>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/10" />
      </section>

      <section id="kebutuhan" className="bg-[#f5f2eb] py-20 sm:py-28">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#24563b]">01 · Mulai di sini</p><h2 className="mt-4 max-w-xl font-serif text-5xl font-normal leading-[.95] tracking-[-.05em] sm:text-6xl">Apa yang sedang Anda rencanakan?</h2></div>
            <p className="max-w-lg text-sm leading-7 text-black/55 lg:justify-self-end">Anda tidak harus tahu nama layanan yang tepat. Pilih situasinya, ceritakan kebutuhan Anda, lalu kita tentukan langkah berikutnya.</p>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <a key={item.number} href="/contact" className="group min-h-[290px] rounded-[22px] border border-black/10 bg-[#ebe7de] p-7 transition duration-300 hover:-translate-y-2 hover:bg-[#173d29] hover:text-white">
                <div className="flex items-start justify-between"><span className="text-[10px] font-bold tracking-[.2em] opacity-45">{item.number}</span><span className="text-2xl transition group-hover:translate-x-1">↗</span></div>
                <div className="mt-20"><h3 className="font-serif text-3xl leading-none tracking-[-.04em]">{item.title}</h3><p className="mt-4 text-xs leading-6 opacity-60">{item.text}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="inspirasi" className="bg-[#e6e0d5] py-20 sm:py-28">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#24563b]">02 · Inspirasi</p><h2 className="mt-4 font-serif text-5xl font-normal leading-none tracking-[-.05em] sm:text-7xl">Lihat kemungkinan.</h2></div><p className="max-w-sm text-sm leading-6 text-black/55">Contoh visual adalah titik awal. Solusi akhir selalu menyesuaikan kebutuhan dan kondisi proyek nyata.</p></div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.18fr_.82fr]">
            <article className="group relative min-h-[580px] overflow-hidden rounded-[28px] bg-black text-white"><div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${projects[0].image})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><div className="absolute bottom-7 left-7 right-7"><p className="text-[9px] uppercase tracking-[.22em] text-white/55">{projects[0].type}</p><h3 className="mt-2 font-serif text-4xl">{projects[0].title}</h3><p className="mt-2 text-xs text-white/65">{projects[0].location}</p></div></article>
            <div className="grid gap-5">
              {projects.slice(1).map((project) => <article key={project.title} className="group relative min-h-[278px] overflow-hidden rounded-[28px] bg-black text-white"><div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${project.image})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><div className="absolute bottom-6 left-6"><p className="text-[9px] uppercase tracking-[.2em] text-white/55">{project.type}</p><h3 className="mt-1 font-serif text-2xl">{project.title}</h3></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#24563b]">03 · Cara kami membantu</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.95] tracking-[-.05em] sm:text-6xl">Anda bawa ceritanya. Kami bantu merapikan jalannya.</h2></div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {steps.map(([number, title, text]) => <div key={number} className="grid gap-4 py-7 sm:grid-cols-[70px_190px_1fr]"><span className="text-[10px] font-bold tracking-[.2em] text-[#24563b]">{number}</span><h3 className="font-serif text-2xl">{title}</h3><p className="text-sm leading-6 text-black/55">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="estimasi" className="bg-[#173d29] py-20 text-white sm:py-28">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#d9b98c]">04 · Estimasi awal</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.95] tracking-[-.05em] sm:text-6xl">Punya gambaran proyek? Cek angkanya.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/60">Gunakan estimator sebagai gambaran awal sebelum berkonsultasi. Nilai akhir tetap mengikuti kebutuhan dan lingkup proyek.</p></div>
            <div className="rounded-[28px] bg-white p-2 text-[#1d211d] shadow-2xl sm:p-4"><ArchitectureEstimator /></div>
          </div>
        </div>
      </section>

      <TeamSection />

      <section id="cara-kerja" className="bg-[#f5f2eb] py-20 sm:py-28">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#24563b]">05 · Partner profesional</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end"><h2 className="font-serif text-5xl font-normal leading-[.92] tracking-[-.05em] sm:text-7xl">Satu pintu untuk memulai.<br /><i>Profesional yang tepat</i> untuk melanjutkan.</h2><p className="text-sm leading-7 text-black/55">RUMAH ARSITEK adalah brand yang membantu mempertemukan kebutuhan proyek dengan tenaga profesional yang sesuai. Kediri adalah titik awal, bukan batas perjalanan.</p></div>
        </div>
      </section>

      <section className="bg-[#d9b98c] py-16 sm:py-24">
        <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#173d29]">06 · Mulai sekarang</p><h2 className="mt-4 max-w-3xl font-serif text-5xl font-normal leading-[.92] tracking-[-.05em] text-[#173d29] sm:text-7xl">Punya rencana ruang?<br />Ceritakan dulu.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-[#173d29]/65">Tidak harus punya gambar. Tidak harus paham istilah teknis. Mulai dari kondisi yang Anda punya sekarang.</p></div><div className="flex flex-col gap-3"><a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#173d29] px-7 py-4 text-center text-sm font-extrabold text-white">Chat WhatsApp <Arrow dark /></a><a href="/contact" className="rounded-full border border-[#173d29]/30 px-7 py-4 text-center text-sm font-bold text-[#173d29]">Isi kebutuhan proyek</a></div></div>
      </section>

      <footer className="bg-[#101f17] py-12 text-white">
        <div className="mx-auto w-[min(1240px,calc(100%-32px))]">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
            <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 font-serif text-lg">R</span><strong className="text-sm tracking-[.16em]">RUMAH ARSITEK</strong></div><p className="mt-5 max-w-sm text-sm leading-6 text-white/45">Partner untuk memulai dan menemukan solusi profesional bagi kebutuhan ruang Anda.</p></div>
            <div className="flex flex-col gap-3 text-xs text-white/55"><a href="#kebutuhan">Kebutuhan</a><a href="#inspirasi">Inspirasi</a><a href="#estimasi">Estimasi</a><a href="#cara-kerja">Cara Kerja</a></div>
            <div><span className="text-[9px] uppercase tracking-[.2em] text-white/35">Starting point</span><strong className="mt-2 block font-serif text-xl">Kediri, Jawa Timur</strong><a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-bold text-[#d9b98c]">WhatsApp →</a></div>
          </div>
          <div className="flex flex-col gap-2 pt-6 text-[9px] uppercase tracking-[.15em] text-white/30 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} RUMAH ARSITEK</span><span>Designed around your needs.</span></div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-40 rounded-full bg-[#173d29] px-5 py-4 text-center text-sm font-extrabold text-white shadow-2xl sm:hidden">Konsultasi via WhatsApp ↗</a>
    </main>
  );
}
