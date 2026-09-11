"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";

const whatsappMessage = encodeURIComponent(
  "Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya."
);

const needs = [
  ["01", "Bangun rumah", "Masih berupa keinginan atau gambaran sederhana? Kita mulai dari kebutuhan Anda."],
  ["02", "Renovasi", "Ada bagian rumah yang ingin diperbaiki, ditambah, atau dibuat lebih nyaman."],
  ["03", "Interior", "Ingin ruang terasa lebih rapi, nyaman, terang, dan sesuai dengan keseharian Anda."],
  ["04", "Proyek usaha", "Café, toko, kantor, kos, villa, guest house, dan kebutuhan ruang lainnya."],
];

const steps = [
  ["01", "Cerita", "Ceritakan saja kondisi dan keinginan Anda. Tidak perlu memakai istilah teknis."],
  ["02", "Pahami", "Kita rapikan kebutuhan, prioritas, dan gambaran biaya agar Anda lebih mudah menentukan langkah."],
  ["03", "Hubungkan", "Jika membutuhkan pekerjaan teknis, Anda dapat diarahkan kepada partner profesional yang sesuai."],
];

const faq = [
  ["Saya belum punya desain. Bisa mulai?", "Bisa. Anda justru boleh datang saat semuanya masih berupa ide, kebutuhan, atau masalah yang ingin diselesaikan."],
  ["Apakah RUMAH ARSITEK adalah biro arsitek?", "RUMAH ARSITEK adalah brand/platform yang membantu Anda memulai kebutuhan ruang dan menemukan profesional yang sesuai."],
  ["Apakah hanya untuk Kediri?", "Kediri adalah titik awal. Konsep RUMAH ARSITEK disiapkan untuk berkembang ke berbagai wilayah melalui jaringan partner."],
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const wa = useMemo(() => `https://wa.me/${number}?text=${whatsappMessage}`, [number]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[#26342b]">
      <header className="sticky top-0 z-50 border-b border-[#dfe7df] bg-[#fbfaf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] w-[min(1180px,calc(100%-32px))] items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#dcebdc] font-serif text-lg font-semibold text-[#286044]">R</span>
            <span className="text-[13px] font-bold tracking-[.14em] text-[#244332]">RUMAH ARSITEK</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#kebutuhan" className="text-xs font-semibold text-[#526057] transition hover:text-[#286044]">Kebutuhan</a>
            <a href="#cara" className="text-xs font-semibold text-[#526057] transition hover:text-[#286044]">Cara mulai</a>
            <a href="#estimasi" className="text-xs font-semibold text-[#526057] transition hover:text-[#286044]">Estimasi</a>
            <a href="#faq" className="text-xs font-semibold text-[#526057] transition hover:text-[#286044]">FAQ</a>
          </nav>
          <a href={wa} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#286044] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5037] sm:block">Mulai ngobrol ↗</a>
          <button onClick={() => setMenu(!menu)} className="rounded-full border border-[#cfdacf] px-3 py-2 text-lg text-[#286044] md:hidden" aria-label="Menu">{menu ? "×" : "☰"}</button>
        </div>
        {menu && (
          <div className="border-t border-[#dfe7df] bg-[#fbfaf7] px-4 py-2 md:hidden">
            {[["#kebutuhan", "Kebutuhan"], ["#cara", "Cara mulai"], ["#estimasi", "Estimasi"], ["#faq", "FAQ"], ["/contact", "Mulai konsultasi"]].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMenu(false)} className="block border-b border-[#e4e9e4] py-4 text-sm font-semibold text-[#26342b]">{label}</a>
            ))}
          </div>
        )}
      </header>

      <section className="relative isolate overflow-hidden bg-[#eef5ee]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,.95),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(220,237,221,.8),transparent_38%)]" />
        <div className="mx-auto grid min-h-[650px] w-[min(1180px,calc(100%-32px))] items-center gap-10 py-14 sm:min-h-[720px] sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10 max-w-2xl lg:pr-5">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfe0d0] bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#286044] shadow-sm"><span className="h-2 w-2 rounded-full bg-[#77a77f]" /> Tempat pertama untuk mulai</div>
            <h1 className="font-serif text-[clamp(48px,7vw,88px)] font-normal leading-[.94] tracking-[-.055em] text-[#203329]">Punya rencana ruang?<br /><span className="text-[#3e7650]">Cerita saja.</span></h1>
            <p className="mt-7 max-w-xl text-base font-medium leading-8 text-[#4d5b52] sm:text-lg">Tidak harus sudah punya desain. Tidak harus mengerti arsitektur. Ceritakan saja apa yang Anda inginkan, lalu kita cari jalan yang paling masuk akal.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#286044] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#286044]/15 transition hover:-translate-y-0.5 hover:bg-[#1f5037]">Ceritakan rencana saya ↗</a>
              <a href="#kebutuhan" className="rounded-full border border-[#cbd9cc] bg-white/80 px-6 py-4 text-sm font-bold text-[#286044] transition hover:bg-white">Lihat kebutuhan</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#66736a]"><span>Rumah</span><span>•</span><span>Renovasi</span><span>•</span><span>Interior</span><span>•</span><span>Ruang usaha</span></div>
          </div>
          <div className="relative z-10 lg:pl-6">
            <div className="relative overflow-hidden rounded-[34px] border-[10px] border-white bg-white shadow-[0_30px_80px_rgba(45,70,52,.14)]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=88" alt="Rumah dengan interior terang dan cahaya alami" className="h-[390px] w-full object-cover sm:h-[500px]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:left-auto sm:max-w-[280px]">
                <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#6b796f]">Mulai dari kebutuhan</p>
                <p className="mt-1 font-serif text-xl leading-tight text-[#26342b]">Bukan dari istilah teknis.</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-[#d5e3d5] bg-white px-5 py-4 shadow-lg sm:block"><span className="text-xs font-bold text-[#286044]">Santai saja.</span><p className="mt-1 text-xs text-[#69766e]">Kita mulai dari cerita Anda.</p></div>
          </div>
        </div>
      </section>

      <section id="kebutuhan" className="bg-white py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">01 · Mulai dari situasi Anda</p><h2 className="mt-4 max-w-2xl font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] text-[#26342b] sm:text-6xl">Tidak perlu tahu nama jasanya.</h2></div>
            <p className="max-w-lg text-sm font-medium leading-7 text-[#5a675f]">Pilih cerita yang paling dekat dengan keadaan Anda. Kita mulai dari kebutuhan nyata, bukan dari istilah yang rumit.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {needs.map(([n, title, text], i) => (
              <a key={n} href="/contact" className={`group relative overflow-hidden rounded-[28px] border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9 ${i % 2 === 0 ? "border-[#dbe8dc] bg-[#f1f7f1]" : "border-[#e8e1d3] bg-[#faf6ed]"}`}>
                <span className="absolute -right-2 -top-8 font-serif text-[130px] leading-none text-[#286044]/[.055]">{n}</span>
                <span className="relative inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-extrabold tracking-[.15em] text-[#3e7650] shadow-sm">{n}</span>
                <div className="relative mt-16"><h3 className="font-serif text-3xl tracking-[-.03em] text-[#26342b] sm:text-4xl">{title}</h3><p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#59665e]">{text}</p></div>
                <span className="absolute bottom-8 right-8 grid h-10 w-10 place-items-center rounded-full bg-white text-[#286044] shadow-sm transition group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="cara" className="bg-[#f3f7f2] py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">02 · Cara memulai</p>
            <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] text-[#26342b] sm:text-6xl">Pelan-pelan saja. Yang penting jelas.</h2>
            <p className="mt-6 max-w-md text-sm font-medium leading-7 text-[#59665e]">Percakapan pertama tidak harus berujung keputusan. Kita pahami dulu apa yang Anda butuhkan, lalu lihat pilihan yang paling masuk akal.</p>
            <a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-white px-6 py-4 text-sm font-bold text-[#286044] shadow-md ring-1 ring-[#d8e4d8] transition hover:-translate-y-0.5">Tanya dulu, tidak apa-apa ↗</a>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-[#dce7dd] bg-white shadow-[0_20px_60px_rgba(45,70,52,.08)]">
            <div className="grid md:grid-cols-[.75fr_1.25fr]">
              <div className="relative min-h-[250px] overflow-hidden md:min-h-full"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85" alt="Interior rumah yang terang dan nyaman" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#203329]/35 to-transparent" /></div>
              <div className="p-6 sm:p-9">{steps.map(([n, title, text]) => <div key={n} className="grid gap-3 border-b border-[#e4ebe4] py-6 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[48px_130px_1fr]"><span className="text-[10px] font-extrabold tracking-[.18em] text-[#3e7650]">{n}</span><h3 className="font-serif text-2xl text-[#26342b]">{title}</h3><p className="text-sm font-medium leading-6 text-[#59665e]">{text}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="estimasi" className="bg-[#eaf3ea] py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-10 max-w-2xl"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">03 · Gambaran awal</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] text-[#26342b] sm:text-6xl">Ingin tahu kira-kira berapa yang perlu disiapkan?</h2><p className="mt-5 text-sm font-medium leading-7 text-[#59665e]">Gunakan estimator sebagai titik awal. Bukan harga final, tetapi gambaran supaya Anda punya bahan untuk mulai berdiskusi.</p></div>
          <div className="relative overflow-hidden rounded-[34px] border border-[#d7e5d8] bg-white p-4 shadow-[0_25px_70px_rgba(45,70,52,.09)] sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#edf5ed] blur-2xl" />
            <div className="relative"><ArchitectureEstimator /></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[34px] bg-[#dcebdd] p-2"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=88" alt="Ruang interior yang hangat dan nyaman" className="h-[450px] w-full rounded-[28px] object-cover sm:h-[570px]" /><div className="absolute bottom-7 left-7 max-w-xs rounded-2xl bg-white/95 p-5 shadow-xl"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6b796f]">Cara pandang</p><p className="mt-2 font-serif text-xl leading-tight text-[#26342b]">Ruang yang baik terasa pas untuk orang yang menggunakannya.</p></div></div>
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">04 · Tentang ruang</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] text-[#26342b] sm:text-6xl">Bagus dilihat. Enak dijalani.</h2><p className="mt-6 text-sm font-medium leading-7 text-[#59665e]">Desain bukan sekadar gambar yang indah. Ada kebiasaan, ukuran, anggaran, kondisi bangunan, cahaya, sirkulasi, dan banyak cerita kecil yang membuat sebuah ruang benar-benar terasa milik penggunanya.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#e0e9e0] bg-[#f7faf7] p-5"><strong className="font-serif text-xl text-[#26342b]">Fungsional</strong><p className="mt-2 text-xs font-medium leading-5 text-[#637067]">Mengikuti kehidupan dan kebutuhan nyata.</p></div><div className="rounded-2xl border border-[#e9e3d6] bg-[#fcf9f2] p-5"><strong className="font-serif text-xl text-[#26342b]">Terarah</strong><p className="mt-2 text-xs font-medium leading-5 text-[#637067]">Membantu keputusan terasa lebih sederhana.</p></div></div></div>
        </div>
      </section>

      <section id="faq" className="bg-[#f7f8f5] py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">05 · Sebelum ngobrol</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] text-[#26342b] sm:text-6xl">Mungkin Anda juga sedang bertanya.</h2><p className="mt-5 max-w-md text-sm font-medium leading-7 text-[#59665e]">Tidak ada pertanyaan yang terlalu awal. Justru dari pertanyaan sederhana biasanya percakapan yang baik dimulai.</p></div>
          <div className="overflow-hidden rounded-[28px] border border-[#dde5dd] bg-white px-6 sm:px-8">{faq.map(([q, a], i) => <button key={q} type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full border-b border-[#e4e9e4] py-6 text-left last:border-0"><div className="flex justify-between gap-5"><span className="font-serif text-xl text-[#26342b] sm:text-2xl">{q}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf5ed] text-lg font-bold text-[#286044]">{faqOpen === i ? "−" : "+"}</span></div>{faqOpen === i && <p className="mt-4 max-w-2xl pr-8 text-sm font-medium leading-7 text-[#59665e]">{a}</p>}</button>)}</div>
        </div>
      </section>

      <section className="bg-[#dcebdc] py-16 sm:py-20">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#3e7650]">Tidak perlu buru-buru</p><h2 className="mt-3 max-w-3xl font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] text-[#26342b] sm:text-7xl">Ceritakan saja. Kita lihat bersama.</h2></div><a href={wa} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-[#286044] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#286044]/15 transition hover:-translate-y-0.5">Mulai ngobrol di WhatsApp ↗</a></div>
      </section>

      <footer className="bg-[#edf3ed] py-10"><div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[13px] font-bold tracking-[.16em] text-[#244332]">RUMAH ARSITEK</p><p className="mt-2 max-w-md text-xs font-medium leading-6 text-[#68756c]">Partner untuk memulai dan menemukan solusi profesional bagi kebutuhan rumah, renovasi, interior, dan ruang komersial.</p></div><div className="flex gap-5 text-xs font-semibold text-[#5b685f]"><a href="/contact">Kontak</a><a href="/privacy">Privasi</a><a href="/terms">Ketentuan</a></div></div></footer>
      <a href={wa} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-40 rounded-full bg-[#286044] px-5 py-4 text-center text-sm font-bold text-white shadow-2xl sm:hidden">Ceritakan kebutuhan Anda ↗</a>
    </main>
  );
}
