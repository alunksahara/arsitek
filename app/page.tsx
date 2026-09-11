"use client";

import { useMemo, useState } from "react";
import ArchitectureEstimator from "@/components/ArchitectureEstimator";

const whatsappMessage = encodeURIComponent("Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya.");

const needs = [
  ["01", "Mau bangun rumah", "Mulai dari cerita tentang keluarga, lahan, kebutuhan, dan gaya hidup Anda."],
  ["02", "Mau renovasi", "Perbaiki ruang yang terasa kurang nyaman tanpa harus tahu istilah teknisnya."],
  ["03", "Mau menata interior", "Buat ruang terasa lebih rapi, nyaman, dan sesuai dengan keseharian."],
  ["04", "Punya ruang usaha", "Café, toko, kantor, kos, villa, guest house, dan berbagai kebutuhan komersial."],
];

const steps = [
  ["01", "Ceritakan", "Apa yang ingin dibuat, diperbaiki, atau diwujudkan? Ceritakan dengan bahasa Anda sendiri."],
  ["02", "Kita petakan", "Kebutuhan, prioritas, kondisi, dan gambaran biaya dirapikan agar lebih mudah dipahami."],
  ["03", "Temukan jalan", "Bila diperlukan, Anda dapat diarahkan kepada partner profesional yang sesuai dengan kebutuhan proyek."],
];

const faq = [
  ["Saya belum punya desain. Bisa mulai?", "Bisa. Bahkan lebih baik mulai dari kebutuhan. Desain dan langkah teknis bisa dibicarakan setelah arahnya lebih jelas."],
  ["Apakah harus sudah punya budget?", "Tidak harus. Estimator dapat membantu memberi gambaran awal sebelum Anda menentukan langkah berikutnya."],
  ["Apakah hanya melayani Kediri?", "Kediri adalah titik awal. RUMAH ARSITEK disiapkan untuk berkembang melalui jaringan partner di berbagai wilayah."],
  ["Siapa yang mengerjakan proyeknya?", "RUMAH ARSITEK membantu mempertemukan kebutuhan Anda dengan tenaga profesional atau partner yang sesuai."],
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const wa = useMemo(() => `https://wa.me/${number}?text=${whatsappMessage}`, [number]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcfbf8] text-[#26352c]">
      <header className="sticky top-0 z-50 border-b border-[#e8ebe5] bg-[#fcfbf8]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-[min(1160px,calc(100%-32px))] items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2f6b4a] text-lg font-black text-white">R</span>
            <span className="text-[13px] font-black tracking-[.12em] text-[#26352c]">RUMAH ARSITEK</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#pilihan" className="text-sm font-semibold text-[#657168] hover:text-[#2f6b4a]">Kebutuhan</a>
            <a href="#mulai" className="text-sm font-semibold text-[#657168] hover:text-[#2f6b4a]">Cara mulai</a>
            <a href="#estimasi" className="text-sm font-semibold text-[#657168] hover:text-[#2f6b4a]">Estimasi</a>
            <a href="#faq" className="text-sm font-semibold text-[#657168] hover:text-[#2f6b4a]">FAQ</a>
          </nav>
          <a href={wa} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#2f6b4a] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#275a3e] sm:block">Ngobrol dulu ↗</a>
          <button onClick={() => setMenu(!menu)} aria-label="Menu" className="rounded-full border border-[#d8ded7] px-3 py-2 text-xl text-[#2f6b4a] md:hidden">{menu ? "×" : "☰"}</button>
        </div>
        {menu && <div className="border-t border-[#e8ebe5] bg-[#fcfbf8] px-4 md:hidden">{[["#pilihan","Kebutuhan"],["#mulai","Cara mulai"],["#estimasi","Estimasi"],["#faq","FAQ"],["/contact","Konsultasi"]].map(([href,label]) => <a key={label} href={href} onClick={() => setMenu(false)} className="block border-b border-[#ecefe9] py-4 text-sm font-bold text-[#26352c]">{label}</a>)}</div>}
      </header>

      <section className="relative overflow-hidden bg-[#edf5ed]">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#d9eadb] blur-3xl" />
        <div className="relative mx-auto grid min-h-[680px] w-[min(1160px,calc(100%-32px))] items-center gap-12 py-14 lg:grid-cols-[.92fr_1.08fr]">
          <div className="z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2f6b4a] shadow-sm ring-1 ring-[#dce8dc]"><span className="h-2 w-2 rounded-full bg-[#79ad85]" /> Tidak harus tahu harus mulai dari mana</div>
            <h1 className="max-w-2xl text-[clamp(48px,7vw,86px)] font-black leading-[.94] tracking-[-.055em] text-[#21382a]">Rumah, ruang,<br /><span className="text-[#3d8057]">cerita Anda.</span></h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[#526158]">Punya rencana bangun, renovasi, atau menata ruang? Ceritakan dulu. Kami bantu membuat langkah pertamanya terasa sederhana.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#2f6b4a]/15 hover:-translate-y-0.5">Ceritakan kebutuhan ↗</a><a href="#pilihan" className="rounded-full bg-white px-7 py-4 text-sm font-bold text-[#2f6b4a] shadow-sm ring-1 ring-[#d8e4d8]">Lihat pilihan</a></div>
            <div className="mt-10 flex flex-wrap gap-3 text-xs font-bold text-[#69776e]"><span className="rounded-full bg-white/70 px-3 py-2">Rumah</span><span className="rounded-full bg-white/70 px-3 py-2">Renovasi</span><span className="rounded-full bg-white/70 px-3 py-2">Interior</span><span className="rounded-full bg-white/70 px-3 py-2">Usaha</span></div>
          </div>
          <div className="relative z-10">
            <div className="relative ml-auto max-w-[590px] overflow-hidden rounded-[38px] bg-white p-2 shadow-[0_35px_90px_rgba(43,76,55,.16)]">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90" alt="Interior rumah terang dengan cahaya alami" className="h-[420px] w-full rounded-[30px] object-cover sm:h-[540px]" />
              <div className="absolute left-7 top-7 rounded-2xl bg-white/95 px-5 py-4 shadow-lg"><p className="text-xs font-bold text-[#68766d]">MULAI DARI SINI</p><p className="mt-1 text-base font-black text-[#26352c]">Tidak perlu istilah rumit.</p></div>
              <div className="absolute bottom-7 right-7 max-w-[230px] rounded-2xl bg-[#fffdf7] p-5 shadow-xl"><p className="text-sm font-black text-[#2f6b4a]">Santai saja.</p><p className="mt-1 text-xs font-medium leading-5 text-[#66736b]">Kita cari solusi yang masuk akal untuk kebutuhan Anda.</p></div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl bg-[#f7c98b] px-5 py-4 shadow-lg sm:block"><span className="text-xs font-black text-[#704b24]">Ide dulu.</span><p className="mt-1 text-xs font-semibold text-[#805c32]">Keputusan belakangan.</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8ebe5] bg-white"><div className="mx-auto grid w-[min(1160px,calc(100%-32px))] grid-cols-2 divide-x divide-[#e8ebe5] sm:grid-cols-4"><div className="px-4 py-6 text-center sm:px-6"><p className="text-xl font-black text-[#2f6b4a]">Rumah</p><p className="mt-1 text-xs text-[#727d76]">Hunian baru</p></div><div className="px-4 py-6 text-center sm:px-6"><p className="text-xl font-black text-[#2f6b4a]">Renovasi</p><p className="mt-1 text-xs text-[#727d76]">Perbaiki ruang</p></div><div className="border-t border-[#e8ebe5] px-4 py-6 text-center sm:border-t-0 sm:px-6"><p className="text-xl font-black text-[#2f6b4a]">Interior</p><p className="mt-1 text-xs text-[#727d76]">Bikin nyaman</p></div><div className="border-t border-[#e8ebe5] px-4 py-6 text-center sm:border-t-0 sm:px-6"><p className="text-xl font-black text-[#2f6b4a]">Usaha</p><p className="mt-1 text-xs text-[#727d76]">Ruang bisnis</p></div></div></section>

      <section id="pilihan" className="bg-[#fcfbf8] py-20 sm:py-28">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="max-w-2xl"><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">01 · Pilih yang paling dekat</span><h2 className="mt-4 text-5xl font-black leading-[.98] tracking-[-.045em] text-[#26352c] sm:text-6xl">Anda tidak perlu tahu nama layanan.</h2><p className="mt-5 text-base font-medium leading-7 text-[#647168]">Cukup pilih situasinya. Dari sana, kita bisa mulai membicarakan kebutuhan dengan bahasa yang lebih sederhana.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {needs.map(([n,title,text],i)=><a href="/contact" key={n} className={`group relative min-h-[250px] overflow-hidden rounded-[32px] border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-9 ${i===0?"bg-[#e9f3e9] border-[#d4e5d5]":i===1?"bg-[#fff2df] border-[#f0dfc4]":i===2?"bg-[#eaf1f7] border-[#d7e2ec]":"bg-[#f6e9ee] border-[#ead7df]"}`}><span className="absolute right-4 top-0 text-[110px] font-black leading-none text-black/[.035]">{n}</span><span className="relative inline-flex rounded-full bg-white/85 px-3 py-1 text-[10px] font-black text-[#597068]">{n}</span><div className="relative mt-16 max-w-md"><h3 className="text-3xl font-black tracking-[-.035em] text-[#26352c]">{title}</h3><p className="mt-3 text-sm font-medium leading-6 text-[#5d6b62]">{text}</p></div><span className="absolute bottom-7 right-7 grid h-11 w-11 place-items-center rounded-full bg-white text-lg font-bold text-[#2f6b4a] shadow-sm transition group-hover:translate-x-1">↗</span></a>)}
          </div>
        </div>
      </section>

      <section id="mulai" className="bg-[#2f6b4a] py-20 text-white sm:py-28"><div className="mx-auto w-[min(1160px,calc(100%-32px))]"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center"><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#b9dfc0]">02 · Begini cara kami membantu</span><h2 className="mt-4 text-5xl font-black leading-[.96] tracking-[-.05em] sm:text-6xl">Tidak perlu langsung memutuskan apa-apa.</h2><p className="mt-6 max-w-md text-sm font-medium leading-7 text-white/80">Percakapan pertama dibuat untuk membuat Anda lebih paham, bukan untuk membuat Anda terburu-buru.</p><a href={wa} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-white px-6 py-4 text-sm font-black text-[#2f6b4a]">Tanya dulu ↗</a></div><div className="rounded-[32px] bg-white p-5 text-[#26352c] shadow-2xl sm:p-8">{steps.map(([n,title,text])=><div key={n} className="grid gap-3 border-b border-[#e6ebe6] py-7 last:border-0 last:pb-2 sm:grid-cols-[48px_150px_1fr]"><span className="text-xs font-black text-[#4d8a61]">{n}</span><h3 className="text-2xl font-black">{title}</h3><p className="text-sm font-medium leading-6 text-[#647168]">{text}</p></div>)}</div></div></div></section>

      <section id="estimasi" className="bg-[#fff2df] py-20 sm:py-28"><div className="mx-auto w-[min(1160px,calc(100%-32px))]"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#a36a2c]">03 · Sebelum melangkah</span><h2 className="mt-4 text-5xl font-black leading-[.98] tracking-[-.045em] text-[#3b3125] sm:text-6xl">Penasaran kisaran biayanya?</h2><p className="mt-5 text-sm font-medium leading-7 text-[#6d6255]">Coba hitung gambaran awal. Tidak menggantikan penawaran profesional, tetapi cukup untuk membantu Anda punya bayangan.</p></div><div className="rounded-[32px] bg-white p-4 shadow-[0_25px_70px_rgba(115,78,37,.12)] sm:p-8"><ArchitectureEstimator /></div></div></div></section>

      <section className="bg-white py-20 sm:py-28"><div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div className="relative"><div className="rounded-[38px] bg-[#e9f3e9] p-3"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=90" alt="Ruang interior nyaman dengan cahaya alami" className="h-[450px] w-full rounded-[30px] object-cover sm:h-[560px]" /></div><div className="absolute -bottom-5 left-5 max-w-[270px] rounded-2xl bg-white p-5 shadow-xl"><p className="text-xs font-black text-[#2f6b4a]">Ruang yang baik</p><p className="mt-1 text-sm font-semibold leading-6 text-[#59675e]">bukan hanya enak dilihat, tetapi enak digunakan.</p></div></div><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">04 · Cara pandang</span><h2 className="mt-4 text-5xl font-black leading-[.98] tracking-[-.045em] text-[#26352c] sm:text-6xl">Yang penting bukan kelihatan hebat.</h2><p className="mt-6 text-base font-medium leading-8 text-[#5d6b62]">Yang penting ruangnya masuk akal untuk orang yang menggunakannya. Kebutuhan, kebiasaan, anggaran, cahaya, ukuran, sirkulasi, dan kondisi bangunan semuanya punya cerita.</p><div className="mt-8 flex flex-wrap gap-3"><span className="rounded-full bg-[#e9f3e9] px-4 py-3 text-sm font-bold text-[#2f6b4a]">Nyaman</span><span className="rounded-full bg-[#fff2df] px-4 py-3 text-sm font-bold text-[#8b5a27]">Masuk akal</span><span className="rounded-full bg-[#eaf1f7] px-4 py-3 text-sm font-bold text-[#41657e]">Sesuai kebutuhan</span></div></div></div></section>

      <section id="faq" className="bg-[#f4f7f3] py-20 sm:py-28"><div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><span className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">05 · Pertanyaan</span><h2 className="mt-4 text-5xl font-black leading-[.98] tracking-[-.045em] text-[#26352c] sm:text-6xl">Masih ada yang ingin ditanyakan?</h2><p className="mt-5 text-sm font-medium leading-7 text-[#647168]">Wajar. Mulai dari pertanyaan yang paling sederhana sekalipun.</p></div><div className="overflow-hidden rounded-[30px] bg-white px-6 shadow-sm ring-1 ring-[#e0e7df] sm:px-8">{faq.map(([q,a],i)=><button key={q} type="button" onClick={()=>setFaqOpen(faqOpen===i?null:i)} className="w-full border-b border-[#e8ece7] py-6 text-left last:border-0"><div className="flex items-start justify-between gap-5"><span className="text-lg font-black text-[#26352c] sm:text-xl">{q}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e9f3e9] font-black text-[#2f6b4a]">{faqOpen===i?"−":"+"}</span></div>{faqOpen===i&&<p className="mt-4 max-w-2xl pr-10 text-sm font-medium leading-7 text-[#647168]">{a}</p>}</button>)}</div></div></section>

      <section className="bg-[#f7c98b] py-16 sm:py-20"><div className="mx-auto flex w-[min(1160px,calc(100%-32px))] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#765126]">Tidak perlu buru-buru</p><h2 className="mt-3 max-w-3xl text-5xl font-black leading-[.96] tracking-[-.05em] text-[#2f3027] sm:text-7xl">Ada rencana? Cerita saja.</h2><p className="mt-4 text-sm font-semibold text-[#67583f]">Kita mulai dari yang Anda tahu hari ini.</p></div><a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-black text-white shadow-xl">Mulai ngobrol di WhatsApp ↗</a></div></section>

      <footer className="bg-[#eef2ed] py-10"><div className="mx-auto flex w-[min(1160px,calc(100%-32px))] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-black tracking-[.12em] text-[#26352c]">RUMAH ARSITEK</p><p className="mt-2 max-w-lg text-xs font-medium leading-6 text-[#6a766e]">Partner untuk membantu Anda memulai kebutuhan rumah, renovasi, interior, dan ruang usaha lalu menemukan solusi profesional yang sesuai.</p></div><div className="flex gap-5 text-xs font-bold text-[#657168]"><a href="/contact">Kontak</a><a href="/privacy">Privasi</a><a href="/terms">Ketentuan</a></div></div></footer>
      <a href={wa} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-50 rounded-full bg-[#2f6b4a] px-5 py-4 text-center text-sm font-black text-white shadow-2xl sm:hidden">Ceritakan kebutuhan Anda ↗</a>
    </main>
  );
}
