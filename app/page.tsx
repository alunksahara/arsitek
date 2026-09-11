"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";

const whatsappMessage = encodeURIComponent("Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya.");

const needs = [
  ["01", "Bangun rumah", "Mulai dari lahan, kebutuhan keluarga, atau gambaran yang masih sederhana."],
  ["02", "Renovasi", "Ada ruang yang terasa kurang? Kita mulai dari masalahnya, bukan istilah teknisnya."],
  ["03", "Interior", "Buat ruang lebih nyaman, rapi, dan sesuai dengan cara Anda menjalani hari."],
  ["04", "Proyek usaha", "Café, toko, kantor, kos, villa, guest house, dan ruang komersial lainnya."],
];

const steps = [
  ["01", "Cerita", "Ceritakan kebutuhan, keinginan, kondisi, atau masalah yang sedang Anda hadapi."],
  ["02", "Pahami", "Kami bantu merapikan kebutuhan agar pilihan dan langkah berikutnya terasa lebih jelas."],
  ["03", "Hubungkan", "Jika membutuhkan pekerjaan teknis, Anda dapat diarahkan kepada partner profesional yang sesuai."],
];

const faq = [
  ["Saya belum punya desain. Bisa mulai?", "Bisa. Anda justru boleh datang saat masih berupa ide atau kebutuhan sehari-hari."],
  ["Apakah RUMAH ARSITEK adalah biro arsitek?", "RUMAH ARSITEK adalah brand/platform yang membantu Anda memulai kebutuhan ruang dan menemukan profesional yang sesuai."],
  ["Apakah hanya untuk Kediri?", "Kediri adalah titik awal. Konsepnya disiapkan untuk berkembang ke berbagai wilayah melalui jaringan partner."],
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const wa = useMemo(() => `https://wa.me/${number}?text=${whatsappMessage}`, [number]);

  return (
    <main className="min-h-screen bg-[#f5f2e9] text-[#18221b]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#172b20]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex min-h-[70px] w-[min(1180px,calc(100%-32px))] items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d7b47c] font-serif text-lg text-[#172b20]">R</span>
            <span className="text-[13px] font-bold tracking-[.16em]">RUMAH ARSITEK</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#kebutuhan" className="text-xs font-semibold text-white/75 hover:text-white">Kebutuhan</a>
            <a href="#cara" className="text-xs font-semibold text-white/75 hover:text-white">Cara kerja</a>
            <a href="#estimasi" className="text-xs font-semibold text-white/75 hover:text-white">Estimasi</a>
            <a href="#faq" className="text-xs font-semibold text-white/75 hover:text-white">FAQ</a>
          </nav>
          <a href={wa} target="_blank" rel="noreferrer" className="hidden rounded-full bg-white px-5 py-3 text-xs font-bold text-[#172b20] sm:block">Mulai ngobrol ↗</a>
          <button onClick={() => setMenu(!menu)} className="rounded-full border border-white/20 px-3 py-2 text-lg md:hidden" aria-label="Menu">{menu ? "×" : "☰"}</button>
        </div>
        {menu && <div className="border-t border-white/10 bg-[#172b20] px-4 py-2 md:hidden">{[["#kebutuhan","Kebutuhan"],["#cara","Cara kerja"],["#estimasi","Estimasi"],["#faq","FAQ"],["/contact","Mulai konsultasi"]].map(([href,label]) => <a key={label} href={href} onClick={() => setMenu(false)} className="block border-b border-white/10 py-4 text-sm font-semibold text-white">{label}</a>)}</div>}
      </header>

      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#172b20] text-white sm:min-h-[760px]">
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=88" alt="Rumah dengan interior hangat dan cahaya alami" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102219]/95 via-[#172b20]/75 to-[#172b20]/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#172b20] to-transparent" />
        <div className="mx-auto flex min-h-[680px] w-[min(1180px,calc(100%-32px))] flex-col justify-center py-20 sm:min-h-[760px]">
          <p className="mb-6 text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e1bd84]">Tempat pertama untuk mulai</p>
          <h1 className="max-w-4xl font-serif text-[clamp(52px,8vw,104px)] font-normal leading-[.9] tracking-[-.06em]">Punya rencana ruang?<br /><span className="text-[#e4c493]">Cerita dulu.</span></h1>
          <p className="mt-8 max-w-xl text-base font-medium leading-8 text-white/90 sm:text-lg">Tidak harus sudah punya desain. Tidak harus mengerti arsitektur. Ceritakan saja apa yang Anda inginkan, lalu kita cari jalan yang paling masuk akal.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#e1bd84] px-6 py-4 text-sm font-bold text-[#172b20] shadow-lg">Ceritakan rencana saya ↗</a><a href="#kebutuhan" className="rounded-full border border-white/35 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur hover:bg-white/20">Lihat kebutuhan</a></div>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/65"><span>Rumah</span><span>Renovasi</span><span>Interior</span><span>Komersial</span></div>
        </div>
      </section>

      <section id="kebutuhan" className="bg-[#f5f2e9] py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#286044]">01 · Mulai dari situasi Anda</p><h2 className="mt-4 max-w-xl font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] sm:text-6xl">Tidak perlu tahu nama jasanya.</h2></div><p className="max-w-lg text-sm font-medium leading-7 text-[#465047]">Pilih cerita yang paling dekat dengan keadaan Anda. Informasi berikutnya akan terasa lebih mudah kalau kita mulai dari kebutuhan nyata.</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">{needs.map(([n,title,text]) => <a key={n} href="/contact" className="group relative min-h-[260px] overflow-hidden rounded-[28px] bg-[#1e392b] p-7 text-white transition duration-300 hover:-translate-y-1 sm:p-9"><span className="absolute -right-4 -top-10 font-serif text-[150px] leading-none text-white/[.05]">{n}</span><span className="relative text-[10px] font-bold tracking-[.2em] text-[#e1bd84]">{n}</span><div className="relative mt-20"><h3 className="font-serif text-3xl tracking-[-.03em] sm:text-4xl">{title}</h3><p className="mt-3 max-w-md text-sm font-medium leading-6 text-white/75">{text}</p></div><span className="absolute bottom-8 right-8 text-xl text-[#e1bd84] transition group-hover:translate-x-1">↗</span></a>)}</div>
        </div>
      </section>

      <section id="cara" className="relative overflow-hidden bg-[#d9c6a7] py-20 sm:py-28">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[url('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#24553a]">02 · Cara memulai</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] sm:text-6xl">Bukan langsung jualan. Kita pahami dulu.</h2><p className="mt-6 max-w-md text-sm font-medium leading-7 text-[#3d463f]">Kami ingin percakapan pertama terasa ringan. Tujuannya bukan membuat Anda langsung mengambil keputusan, tetapi membantu Anda melihat masalah dan pilihan dengan lebih jelas.</p><a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-[#1d3a2a] px-6 py-4 text-sm font-bold text-white">Tanya dulu, tidak apa-apa ↗</a></div>
          <div className="rounded-[30px] bg-white/95 p-6 shadow-xl shadow-black/10 sm:p-9">{steps.map(([n,title,text]) => <div key={n} className="grid gap-4 border-b border-[#18221b]/12 py-7 last:border-0 sm:grid-cols-[54px_180px_1fr]"><span className="text-[10px] font-extrabold tracking-[.18em] text-[#286044]">{n}</span><h3 className="font-serif text-2xl text-[#18221b]">{title}</h3><p className="text-sm font-medium leading-6 text-[#4b554d]">{text}</p></div>)}</div>
        </div>
      </section>

      <section id="estimasi" className="relative overflow-hidden bg-[#172b20] py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-15" />
        <div className="relative mx-auto w-[min(1180px,calc(100%-32px))]"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#e1bd84]">03 · Gambaran awal</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] sm:text-6xl">Ingin tahu kira-kira berapa yang perlu disiapkan?</h2><p className="mt-6 max-w-md text-sm font-medium leading-7 text-white/80">Gunakan estimator sebagai titik awal. Bukan harga final, tetapi gambaran supaya pembicaraan Anda nanti lebih punya arah.</p></div><div className="rounded-[30px] bg-white p-4 text-[#18221b] shadow-2xl sm:p-7"><ArchitectureEstimator /></div></div></div>
      </section>

      <section className="relative overflow-hidden bg-[#f5f2e9] py-20 sm:py-28"><div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div className="relative overflow-hidden rounded-[34px]"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=88" alt="Ruang interior yang hangat dan nyaman" className="h-[480px] w-full object-cover sm:h-[580px]" /><div className="absolute bottom-5 left-5 max-w-xs rounded-2xl bg-[#172b20]/95 p-5 text-white"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#e1bd84]">Cara pandang</p><p className="mt-2 font-serif text-xl leading-tight">Ruang yang baik harus terasa masuk akal untuk orang yang menggunakannya.</p></div></div><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#286044]">04 · Tentang ruang</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] sm:text-6xl">Bagus dilihat. Nyaman dijalani.</h2><p className="mt-6 text-sm font-medium leading-7 text-[#465047]">Kami percaya desain bukan sekadar gambar yang indah. Ada kebiasaan, ukuran, anggaran, kondisi bangunan, cahaya, sirkulasi, dan banyak cerita kecil yang membuat sebuah ruang benar-benar menjadi milik penggunanya.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white p-5"><strong className="font-serif text-xl text-[#18221b]">Fungsional</strong><p className="mt-2 text-xs font-medium leading-5 text-[#566058]">Mengikuti kehidupan dan kebutuhan nyata.</p></div><div className="rounded-2xl bg-white p-5"><strong className="font-serif text-xl text-[#18221b]">Terarah</strong><p className="mt-2 text-xs font-medium leading-5 text-[#566058]">Membantu keputusan terasa lebih jelas.</p></div></div></div></div></section>

      <section id="faq" className="bg-white py-20 sm:py-28"><div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#286044]">05 · Sebelum ngobrol</p><h2 className="mt-4 font-serif text-5xl font-normal leading-[.94] tracking-[-.05em] sm:text-6xl">Pertanyaan yang mungkin ada di kepala Anda.</h2></div><div className="border-t border-[#18221b]/15">{faq.map(([q,a],i) => <button key={q} type="button" onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full border-b border-[#18221b]/15 py-6 text-left"><div className="flex justify-between gap-5"><span className="font-serif text-xl text-[#18221b] sm:text-2xl">{q}</span><span className="text-xl font-bold text-[#286044]">{faqOpen === i ? "−" : "+"}</span></div>{faqOpen === i && <p className="mt-4 max-w-2xl pr-8 text-sm font-medium leading-7 text-[#4b554d]">{a}</p>}</button>)}</div></div></section>

      <section className="bg-[#d9b47c] py-16 sm:py-20"><div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#24553a]">Tidak perlu buru-buru</p><h2 className="mt-3 max-w-3xl font-serif text-5xl font-normal leading-[.93] tracking-[-.05em] text-[#172b20] sm:text-7xl">Ceritakan saja. Kita lihat bersama.</h2></div><a href={wa} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-[#172b20] px-7 py-4 text-sm font-bold text-white">Mulai ngobrol di WhatsApp ↗</a></div></section>

      <footer className="bg-[#102219] py-10 text-white"><div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[13px] font-bold tracking-[.16em]">RUMAH ARSITEK</p><p className="mt-2 max-w-md text-xs font-medium leading-6 text-white/65">Partner untuk memulai dan menemukan solusi profesional bagi kebutuhan rumah, renovasi, interior, dan ruang komersial.</p></div><div className="flex gap-5 text-xs font-semibold text-white/70"><a href="/contact">Kontak</a><a href="/privacy">Privasi</a><a href="/terms">Ketentuan</a></div></div></footer>
      <a href={wa} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-40 rounded-full bg-[#172b20] px-5 py-4 text-center text-sm font-bold text-white shadow-2xl sm:hidden">Ceritakan kebutuhan Anda ↗</a>
    </main>
  );
}
