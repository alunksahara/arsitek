import Link from "next/link";

const items = [
  ["01", "Rumah baru", "Mulai dari lahan dan kebutuhan keluarga hingga arah desain dan perencanaan."],
  ["02", "Renovasi", "Cari solusi untuk ruang yang terlalu sempit, kurang terang, atau tidak lagi sesuai."],
  ["03", "Interior", "Bangun ruang yang nyaman, fungsional, rapi, dan memiliki karakter."],
  ["04", "Ruang usaha", "Café, toko, kantor, kos, villa, guest house, dan kebutuhan komersial lainnya."],
];

const steps = [
  ["01", "Ceritakan", "Sampaikan kondisi, kebutuhan, lokasi, dan gambaran proyek. Tidak perlu sudah memiliki desain."],
  ["02", "Pahami", "Kebutuhan dipetakan agar jenis solusi dan partner profesional dapat ditentukan dengan tepat."],
  ["03", "Rencanakan", "Bahas arah desain, ruang lingkup, waktu, dan biaya setelah kebutuhan lebih jelas."],
  ["04", "Wujudkan", "Proyek dilanjutkan bersama partner profesional yang sesuai dengan kebutuhan."],
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25342b]">
      <header className="border-b border-[#e6e9e3]">
        <div className="mx-auto flex min-h-[76px] w-[min(1180px,calc(100%-32px))] items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#2f6b4a] font-black text-white">RA</span><span className="text-[13px] font-black tracking-[.12em]">RUMAH ARSITEK</span></Link>
          <Link href="/contact" className="rounded-full bg-[#2f6b4a] px-5 py-3 text-sm font-bold text-white">Konsultasi proyek →</Link>
        </div>
      </header>

      <section className="bg-[#eaf3e9] py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">RUMAH ARSITEK · Layanan</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[.92] tracking-[-.06em] sm:text-7xl">Tidak harus tahu layanan apa yang Anda butuhkan. <span className="text-[#43815a]">Mulai dari proyeknya.</span></h1>
          <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-[#59675e]">Ceritakan kebutuhan ruang Anda. RUMAH ARSITEK membantu memahaminya terlebih dahulu, kemudian mengarahkan kepada solusi dan partner profesional yang sesuai.</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-black text-white">Ceritakan rencana saya →</Link>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">Apa yang bisa dimulai</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl">Satu kebutuhan bisa berkembang menjadi banyak kemungkinan.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {items.map(([no, title, text]) => <article key={no} className="rounded-[28px] border border-[#e1e6e0] bg-white p-7 shadow-sm sm:p-9"><span className="text-xs font-black tracking-[.16em] text-[#78907f]">{no}</span><h3 className="mt-4 text-3xl font-black text-[#2f6b4a]">{title}</h3><p className="mt-4 text-base leading-7 text-[#68756d]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#25342b] py-20 text-white sm:py-28">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#b8d4bd]">Cara mulai</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl">Dari cerita sederhana menuju proyek yang lebih jelas.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">{steps.map(([no, title, text]) => <div key={no} className="border-t border-white/15 pt-5"><span className="text-xs font-black text-[#b8d4bd]">{no}</span><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{text}</p></div>)}</div>
        </div>
      </section>

      <section className="py-20 sm:py-28"><div className="mx-auto w-[min(900px,calc(100%-32px))] rounded-[32px] bg-[#eaf3e9] p-8 text-center sm:p-14"><p className="text-xs font-black uppercase tracking-[.18em] text-[#4d8a61]">Langkah berikutnya</p><h2 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.05em] sm:text-5xl">Punya rencana rumah, renovasi, interior, atau ruang usaha?</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#68756d]">Tidak perlu menunggu semuanya siap. Ceritakan dulu proyeknya. Konsultasi menjadi titik awal.</p><Link href="/contact" className="mt-8 inline-flex rounded-full bg-[#2f6b4a] px-7 py-4 text-sm font-black text-white">Ceritakan rencana saya →</Link></div></section>
    </main>
  );
}
