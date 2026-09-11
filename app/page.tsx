"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";

const whatsappMessage = encodeURIComponent(
  "Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya."
);

const needs = [
  {
    number: "01",
    title: "Mau bangun rumah",
    text: "Masih berupa lahan, sudah punya gambaran, atau justru belum tahu harus mulai dari mana.",
  },
  {
    number: "02",
    title: "Mau renovasi",
    text: "Rumah terasa kurang nyaman, kurang ruang, atau ingin disesuaikan dengan kebutuhan baru.",
  },
  {
    number: "03",
    title: "Butuh interior",
    text: "Ingin ruang yang lebih rapi, nyaman, punya karakter, dan sesuai aktivitas sehari-hari.",
  },
  {
    number: "04",
    title: "Punya proyek usaha",
    text: "Café, toko, kantor, kos, villa, guest house, atau ruang komersial lainnya.",
  },
];

const guide = [
  ["01", "Ceritakan dulu", "Tidak perlu istilah teknis. Ceritakan saja apa yang ingin Anda bangun, ubah, atau perbaiki."],
  ["02", "Kita rapikan kebutuhan", "Kami bantu menyusun kebutuhan supaya Anda punya gambaran langkah, ruang lingkup, dan hal yang perlu disiapkan."],
  ["03", "Cari solusi yang sesuai", "Untuk kebutuhan teknis, Anda dapat diarahkan kepada partner profesional yang sesuai dengan karakter proyek."],
];

const questions = [
  ["Apakah saya harus sudah punya desain?", "Tidak. Justru Anda boleh datang saat masih berupa ide, kebutuhan, atau masalah yang ingin diselesaikan."],
  ["Apakah RUMAH ARSITEK mengerjakan proyek sendiri?", "RUMAH ARSITEK berperan sebagai pintu masuk untuk membantu kebutuhan Anda dan menghubungkan proyek dengan profesional yang sesuai."],
  ["Apakah hanya melayani Kediri?", "Kediri adalah salah satu titik awal. Konsep RUMAH ARSITEK dirancang untuk berkembang ke berbagai wilayah sesuai jaringan partner profesional."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const whatsappUrl = useMemo(
    () => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
    [whatsappNumber]
  );

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#20251f]">
      <header className="sticky top-0 z-50 border-b border-[#20251f]/10 bg-[#f8f7f2]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#244936] font-serif text-lg text-white">R</span>
            <span>
              <strong className="block text-[13px] tracking-[.15em]">RUMAH ARSITEK</strong>
              <small className="hidden text-[9px] uppercase tracking-[.16em] text-black/40 sm:block">Ruang · Solusi · Profesional</small>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#kebutuhan" className="text-xs font-semibold text-black/65 transition hover:text-[#244936]">Kebutuhan</a>
            <a href="#panduan" className="text-xs font-semibold text-black/65 transition hover:text-[#244936]">Panduan</a>
            <a href="#estimasi" className="text-xs font-semibold text-black/65 transition hover:text-[#244936]">Estimasi</a>
            <a href="#faq" className="text-xs font-semibold text-black/65 transition hover:text-[#244936]">Pertanyaan</a>
          </nav>

          <div className="hidden items-center gap-4 sm:flex">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#244936]">WhatsApp</a>
            <a href="/contact" className="rounded-full bg-[#244936] px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#183927]">Mulai ngobrol <Arrow /></a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu((value) => !value)}
            className="rounded-full border border-black/10 px-3 py-2 text-xl md:hidden"
            aria-label="Buka menu"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? "×" : "☰"}
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-black/10 bg-[#f8f7f2] px-4 py-3 md:hidden">
            {[
              ["#kebutuhan", "Kebutuhan"],
              ["#panduan", "Panduan"],
              ["#estimasi", "Estimasi"],
              ["#faq", "Pertanyaan"],
              ["/contact", "Mulai konsultasi"],
            ].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileMenu(false)} className="block border-b border-black/10 py-4 text-sm font-semibold last:border-0">
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="overflow-hidden bg-[#f8f7f2]">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:pt-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#244936]/15 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#244936]">
              <span className="h-2 w-2 rounded-full bg-[#b38a58]" />
              Tidak harus tahu mulai dari mana
            </div>
            <h1 className="max-w-3xl font-serif text-[clamp(48px,7vw,86px)] font-normal leading-[.94] tracking-[-.055em]">
              Punya rencana ruang?<br />
              <span className="text-[#244936]">Cerita dulu.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[16px] leading-8 text-black/58 sm:text-[18px]">
              RUMAH ARSITEK hadir sebagai tempat untuk memulai. Ceritakan kebutuhan Anda, dapatkan informasi yang lebih jelas, lalu tentukan langkah berikutnya tanpa harus pusing dengan istilah teknis.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#244936] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1">Ceritakan rencana saya <Arrow /></a>
              <a href="#kebutuhan" className="rounded-full border border-black/15 bg-white px-6 py-4 text-sm font-bold transition hover:border-[#244936]/30">Lihat pilihannya</a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[.15em] text-black/38">
              <span>Rumah</span><span>Renovasi</span><span>Interior</span><span>Komersial</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[34px] bg-[#ddd7ca]">
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85"
                alt="Inspirasi interior rumah modern"
                className="h-[480px] w-full object-cover sm:h-[580px]"
              />
            </div>
            <div className="absolute -bottom-5 left-5 max-w-[300px] rounded-2xl border border-black/10 bg-white p-5 shadow-xl shadow-black/10 sm:left-[-30px]">
              <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#244936]">Prinsip kami</p>
              <p className="mt-2 font-serif text-xl leading-tight">Bikin prosesnya terasa lebih sederhana.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="kebutuhan" className="border-y border-black/8 bg-white py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#244936]">01 · Kebutuhan Anda</p>
            <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] sm:text-6xl">Tidak perlu tahu nama jasanya.</h2>
            <p className="mt-5 text-sm leading-7 text-black/52">Pilih yang paling mendekati situasi Anda. Dari sini kita bisa mulai membicarakan kebutuhan dengan bahasa yang lebih sederhana.</p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-2">
            {needs.map((item) => (
              <a key={item.number} href="/contact" className="group rounded-[24px] border border-black/10 bg-[#f8f7f2] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#244936]/30 hover:bg-[#244936] hover:text-white sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-[.2em] opacity-40">{item.number}</span>
                  <span className="text-xl transition group-hover:translate-x-1">↗</span>
                </div>
                <h3 className="mt-14 font-serif text-3xl tracking-[-.03em] sm:text-4xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 opacity-55">{item.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="panduan" className="bg-[#e9e4da] py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#244936]">02 · Panduan singkat</p>
            <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] sm:text-6xl">Anda tidak perlu menjadi ahli untuk memulai.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/55">Banyak orang berhenti di awal karena merasa harus mengerti arsitektur, biaya, gambar kerja, material, dan berbagai istilah lainnya. Padahal percakapan pertama bisa sesederhana menceritakan kebutuhan.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-[#244936] px-6 py-4 text-sm font-bold text-white">Tanya dulu, tidak apa-apa <Arrow /></a>
          </div>

          <div className="rounded-[28px] bg-white p-5 sm:p-8">
            {guide.map(([number, title, text]) => (
              <div key={number} className="grid gap-4 border-b border-black/10 py-7 first:pt-3 last:border-0 last:pb-3 sm:grid-cols-[54px_190px_1fr]">
                <span className="text-[10px] font-bold tracking-[.18em] text-[#244936]">{number}</span>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="text-sm leading-6 text-black/52">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estimasi" className="bg-[#244936] py-20 text-white sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#d8b98d]">03 · Estimasi awal</p>
              <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] sm:text-6xl">Ingin punya gambaran biaya?</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/62">Gunakan estimator untuk mendapatkan gambaran awal. Angka ini bukan penawaran final, tetapi bisa membantu Anda memahami skala rencana sebelum berdiskusi lebih jauh.</p>
            </div>
            <div className="rounded-[28px] bg-white p-4 text-[#20251f] sm:p-7">
              <ArchitectureEstimator />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-[30px]">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
              alt="Interior rumah dengan suasana hangat"
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#244936]">04 · Cara pandang</p>
            <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] sm:text-6xl">Ruang yang baik bukan cuma soal terlihat bagus.</h2>
            <p className="mt-6 text-sm leading-7 text-black/55">Ruang harus masuk akal untuk orang yang menggunakannya. Karena itu, percakapan tentang kebiasaan, kebutuhan, anggaran, kondisi lahan atau bangunan, dan tujuan proyek sama pentingnya dengan tampilan visual.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f7f2] p-5"><p className="font-serif text-xl">Fungsional</p><p className="mt-2 text-xs leading-5 text-black/50">Ruang mengikuti kebutuhan nyata.</p></div>
              <div className="rounded-2xl bg-[#f8f7f2] p-5"><p className="font-serif text-xl">Masuk akal</p><p className="mt-2 text-xs leading-5 text-black/50">Keputusan disesuaikan kondisi proyek.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f8f7f2] py-20 sm:py-28">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#244936]">05 · Pertanyaan</p>
            <h2 className="mt-4 font-serif text-5xl font-normal leading-[.96] tracking-[-.05em] sm:text-6xl">Masih ingin tahu?</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-black/52">Tidak ada pertanyaan yang terlalu awal. Justru semakin jelas dari awal, semakin mudah menentukan langkah berikutnya.</p>
          </div>
          <div className="border-t border-black/10">
            {questions.map(([question, answer], index) => (
              <button
                key={question}
                type="button"
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="block w-full border-b border-black/10 py-6 text-left"
                aria-expanded={openQuestion === index}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-serif text-xl sm:text-2xl">{question}</span>
                  <span className="shrink-0 text-xl text-[#244936]">{openQuestion === index ? "−" : "+"}</span>
                </div>
                {openQuestion === index && <p className="mt-4 max-w-2xl pr-8 text-sm leading-7 text-black/52">{answer}</p>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d9b98c] py-16 sm:py-20">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#244936]">Mulai tanpa tekanan</p>
            <h2 className="mt-3 max-w-3xl font-serif text-5xl font-normal leading-[.95] tracking-[-.05em] text-[#244936] sm:text-7xl">Ceritakan saja. Kita lihat bersama.</h2>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 rounded-full bg-[#244936] px-7 py-4 text-sm font-bold text-white">Mulai ngobrol di WhatsApp <Arrow /></a>
        </div>
      </section>

      <footer className="bg-[#183326] py-10 text-white">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-bold tracking-[.16em]">RUMAH ARSITEK</p>
            <p className="mt-2 max-w-md text-xs leading-6 text-white/48">Partner untuk memulai dan menemukan solusi profesional bagi kebutuhan rumah, renovasi, interior, dan ruang komersial.</p>
          </div>
          <div className="flex gap-5 text-xs text-white/55"><a href="/contact" className="hover:text-white">Kontak</a><a href="/privacy" className="hover:text-white">Privasi</a><a href="/terms" className="hover:text-white">Ketentuan</a></div>
        </div>
      </footer>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-full bg-[#244936] px-5 py-4 text-sm font-bold text-white shadow-2xl shadow-black/20 sm:hidden">Ceritakan kebutuhan Anda <Arrow /></a>
    </main>
  );
}
