"use client";

import { useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";

const services = [
  ["Rumah Baru", "Mulai dari kebutuhan keluarga, lahan, luas bangunan, hingga arah desain yang ingin diwujudkan.", "#rumah"],
  ["Renovasi", "Cari tahu apa yang perlu diperbaiki, ditambah, atau ditata ulang sebelum masuk ke keputusan teknis.", "#renovasi"],
  ["Interior", "Membuat ruang lebih nyaman, rapi, fungsional, dan memiliki karakter yang sesuai penggunanya.", "#interior"],
  ["Ruang Usaha", "Café, toko, kantor, villa, guest house, kos, dan ruang komersial lain yang perlu bekerja sekaligus menarik.", "#usaha"],
];

const faqs = [
  ["Apakah saya harus sudah punya desain?", "Tidak. Anda bisa mulai dari kebutuhan dan kondisi proyek. Jika ingin mendapatkan gambaran biaya jasa desain terlebih dahulu, gunakan Estimator."],
  ["Seberapa akurat hasil Estimator?", "Estimator memberikan gambaran awal, bukan quotation final. Nilai akhir dapat berubah mengikuti kompleksitas, kondisi lokasi, kebutuhan ruang, dan lingkup pekerjaan."],
  ["Saya belum tahu budget proyek. Apa yang sebaiknya dilakukan?", "Mulai dari Estimator untuk mendapatkan rentang awal. Setelah itu, Anda dapat mengirimkan kebutuhan dan berdiskusi lebih lanjut dengan tenaga profesional yang sesuai."],
  ["Apakah RUMAH ARSITEK hanya melayani Kediri?", "Kediri adalah titik awal. RUMAH ARSITEK disiapkan untuk berkembang melalui jaringan partner profesional di berbagai wilayah Indonesia."],
  ["Siapa yang mengerjakan proyek saya?", "RUMAH ARSITEK membantu memetakan kebutuhan dan mempertemukan Anda dengan tenaga profesional atau partner yang sesuai. Keputusan teknis dan pelaksanaan ditangani oleh profesional terkait."],
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf6] text-[#25342b] selection:bg-[#cfe4d1] selection:text-[#183624]">
      <header className="sticky top-0 z-50 border-b border-[#e4e8e2]/80 bg-[#fbfaf6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <a href="/" className="group flex shrink-0 items-center gap-3" aria-label="RUMAH ARSITEK beranda">
            <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#2f6b4a] text-sm font-black text-white transition group-hover:rotate-3">RA</span>
            <span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            <a href="#estimator" className="text-sm font-black text-[#2f6b4a] transition hover:text-[#173d29]">Estimasi</a>
            <a href="#kebutuhan" className="text-sm font-semibold text-[#69746d] transition hover:text-[#2f6b4a]">Kebutuhan</a>
            <a href="#perjalanan" className="text-sm font-semibold text-[#69746d] transition hover:text-[#2f6b4a]">Cara mulai</a>
            <a href="/projects" className="text-sm font-semibold text-[#69746d] transition hover:text-[#2f6b4a]">Inspirasi</a>
            <a href="#faq" className="text-sm font-semibold text-[#69746d] transition hover:text-[#2f6b4a]">FAQ</a>
          </nav>
          <a href="#estimator" className="hidden rounded-full bg-[#2f6b4a] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#255a3e] sm:block">Hitung estimasi ↗</a>
          <button type="button" onClick={() => setMenu(!menu)} aria-label="Buka menu" className="rounded-full border border-[#d9dfd8] px-3 py-2 text-xl text-[#2f6b4a] md:hidden">{menu ? "×" : "☰"}</button>
        </div>
        {menu && (
          <div className="border-t border-[#e6e9e3] bg-[#fbfaf6] px-4 md:hidden">
            {[["#estimator", "Hitung estimasi"], ["#kebutuhan", "Kebutuhan"], ["#perjalanan", "Cara mulai"], ["/projects", "Inspirasi proyek"], ["#faq", "FAQ"], ["/contact", "Ceritakan rencana"]].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMenu(false)} className="block border-b border-[#e8ebe6] py-4 text-sm font-bold">{label}</a>
            ))}
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-[#eaf3e9]">
        <div className="absolute -left-40 top-10 h-[360px] w-[360px] rounded-full bg-white/80 blur-3xl" />
        <div className="absolute -right-40 bottom-[-120px] h-[460px] w-[460px] rounded-full bg-[#cfe5d1]/80 blur-3xl" />
        <div className="relative mx-auto grid min-h-[680px] w-[min(1180px,calc(100%-32px))] items-center gap-10 py-12 lg:grid-cols-[.92fr_1.08fr] lg:py-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-[#3b6e4d] shadow-sm ring-1 ring-[#d8e6d9]"><span className="h-2 w-2 rounded-full bg-[#70a77d]" /> Mulai dari gambaran yang lebih jelas</div>
            <h1 className="max-w-[650px] text-[clamp(48px,6.7vw,82px)] font-black leading-[.92] tracking-[-.065em] text-[#20372a]">Rencanakan ruang Anda. <span className="text-[#43815a]">Mulai dari estimasi.</span></h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[#526158] sm:text-xl">Belum punya desain? Tidak masalah. Tentukan jenis proyek, paket desain, dan luas bangunan untuk mendapatkan <strong className="font-black text-[#30483a]">gambaran awal investasi desain</strong> sebelum melangkah lebih jauh.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#estimator" className="rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-black text-white shadow-xl shadow-[#2f6b4a]/20 transition hover:-translate-y-1">Hitung estimasi proyek →</a>
              <a href="/contact" className="rounded-full bg-white px-7 py-4 text-sm font-black text-[#2f6b4a] shadow-sm ring-1 ring-[#d8e4d8] transition hover:-translate-y-1">Ceritakan rencana</a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 text-xs font-bold text-[#68766d]">
              <div className="rounded-2xl border border-[#d5e3d5] bg-white/60 p-4"><strong className="block text-lg text-[#2f6b4a]">01</strong><span>Hitung</span></div>
              <div className="rounded-2xl border border-[#d5e3d5] bg-white/60 p-4"><strong className="block text-lg text-[#2f6b4a]">02</strong><span>Pahami</span></div>
              <div className="rounded-2xl border border-[#d5e3d5] bg-white/60 p-4"><strong className="block text-lg text-[#2f6b4a]">03</strong><span>Konsultasi</span></div>
            </div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[610px]">
            <div className="overflow-hidden rounded-[34px] bg-white p-2 shadow-[0_35px_90px_rgba(43,76,55,.18)]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=90" alt="Interior rumah modern dengan cahaya alami" className="h-[380px] w-full rounded-[27px] object-cover sm:h-[500px]" />
              <div className="absolute left-6 top-6 max-w-[235px] rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur"><p className="text-[10px] font-black tracking-[.14em] text-[#728078]">RUMAH ARSITEK</p><p className="mt-2 text-base font-black leading-5">Gambaran awal sebelum keputusan besar.</p></div>
            </div>
            <div className="absolute -bottom-5 right-5 rounded-2xl bg-[#fff8e9] px-5 py-4 shadow-xl"><p className="text-xs font-black uppercase tracking-[.12em] text-[#855a28]">Langkah pertama</p><p className="mt-1 text-sm font-bold text-[#8b704e]">Tidak harus tahu istilah teknis.</p></div>
          </div>
        </div>
      </section>

      <section id="estimator" className="scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">01 · Estimator</span>
              <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.05em] text-[#25342b] sm:text-6xl">Hitung dulu. Baru tentukan langkah berikutnya.</h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-6 text-[#69756e]">Estimator ini menjadi pintu masuk utama bagi Anda yang ingin memahami gambaran awal biaya jasa desain.</p>
          </div>
          <div className="overflow-hidden rounded-[30px] border border-[#e4e8e2] shadow-[0_20px_70px_rgba(36,60,44,.08)]"><ArchitectureEstimator /></div>
        </div>
      </section>

      <section id="perjalanan" className="scroll-mt-20 bg-[#20372a] py-20 text-white sm:py-24">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div><span className="text-xs font-black uppercase tracking-[.18em] text-[#a8d0b1]">02 · Setelah estimasi</span><h2 className="mt-4 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Dari angka menuju percakapan yang tepat.</h2></div>
            <p className="max-w-xl text-base font-medium leading-7 text-white/70 lg:justify-self-end">Hasil Estimator bukan penawaran final. Jika Anda ingin melanjutkan, hasil estimasi dan konteks proyek akan dibawa ke halaman konsultasi agar pembicaraan berikutnya lebih terarah.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[["01", "Hitung", "Dapatkan rentang awal berdasarkan jenis proyek, paket desain, dan luas bangunan."], ["02", "Konsultasikan", "Data Estimator dibawa ke Contact sehingga Anda tidak perlu mengulang dari awal."], ["03", "Matching", "Kebutuhan kemudian dapat dikualifikasi dan diarahkan kepada partner profesional yang sesuai."]].map(([no, title, text]) => <div key={no} className="rounded-3xl border border-white/10 bg-white/[.06] p-6"><span className="text-xs font-black tracking-[.16em] text-[#a8d0b1]">{no}</span><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="kebutuhan" className="scroll-mt-20 bg-[#fbfaf6] py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">03 · Kebutuhan</span><h2 className="mt-4 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Belum siap menghitung? Mulai dari kebutuhan.</h2></div><a href="/contact" className="shrink-0 rounded-full border border-[#2f6b4a] px-5 py-3 text-sm font-black text-[#2f6b4a] transition hover:bg-[#2f6b4a] hover:text-white">Ceritakan rencana →</a></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([title, text, href], index) => <a id={href.slice(1)} href="/contact" key={title} className="group rounded-[28px] border border-[#e2e7e0] bg-white p-6 transition hover:-translate-y-1 hover:border-[#b9d2bd] hover:shadow-xl"><span className="text-xs font-black tracking-[.16em] text-[#78907f]">0{index + 1}</span><h3 className="mt-7 text-2xl font-black tracking-[-.03em] text-[#2f6b4a]">{title}</h3><p className="mt-3 text-sm font-medium leading-6 text-[#6f7b73]">{text}</p><span className="mt-7 inline-block text-sm font-black text-[#2f6b4a] transition group-hover:translate-x-1">Mulai dari sini →</span></a>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px]"><img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=88" alt="Ruang interior dan arsitektur modern" className="h-[380px] w-full object-cover sm:h-[500px]" /></div>
          <div><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">04 · Inspirasi</span><h2 className="mt-4 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Lihat bagaimana kebutuhan diterjemahkan menjadi ruang.</h2><p className="mt-6 text-base font-medium leading-7 text-[#69756e]">Jelajahi project dan gunakan referensi sebagai bahan percakapan. Setiap proyek tetap perlu disesuaikan dengan kebutuhan dan kondisi nyata.</p><a href="/projects" className="mt-8 inline-flex rounded-full bg-[#2f6b4a] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#255a3e]">Lihat portfolio →</a></div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 bg-[#f4efe5] py-20 sm:py-24">
        <div className="mx-auto w-[min(900px,calc(100%-32px))]"><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">05 · FAQ</span><h2 className="mt-4 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Pertanyaan sebelum mulai.</h2><div className="mt-10 divide-y divide-black/10 border-y border-black/10">{faqs.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setFaqOpen(faqOpen === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left"><span className="text-base font-black sm:text-lg">{question}</span><span className="text-2xl font-light">{faqOpen === index ? "−" : "+"}</span></button>{faqOpen === index && <p className="max-w-3xl pb-6 pr-8 text-sm font-medium leading-7 text-[#62665f]">{answer}</p>}</div>)}</div></div>
      </section>

      <section className="bg-[#eaf3e9] py-16 sm:py-20"><div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-6 rounded-[30px] bg-[#2f6b4a] p-7 text-white shadow-2xl sm:p-10 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-white/65">Langkah berikutnya</p><h2 className="mt-3 max-w-2xl text-4xl font-black leading-[.95] tracking-[-.04em] sm:text-5xl">Sudah punya gambaran? Lanjutkan ke konsultasi.</h2></div><div className="flex shrink-0 flex-wrap gap-3"><a href="#estimator" className="rounded-full bg-white px-6 py-4 text-sm font-black text-[#2f6b4a] transition hover:-translate-y-0.5">Hitung estimasi</a><a href="/contact" className="rounded-full border border-white/30 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10">Ceritakan rencana</a></div></div></section>
    </main>
  );
}
