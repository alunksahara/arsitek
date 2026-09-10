import Link from "next/link";

export type LocationData = {
  city: string;
  slug: string;
  province: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  localContext: string;
  services: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
};

export default function LocationLanding({ location }: { location: LocationData }) {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-green-700">
            RUMAH ARSITEK · {location.province}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            {location.h1}
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 sm:text-xl">
            Merancang rumah dari luar hingga ke dalam.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            {location.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">
              Konsultasi Gratis
            </Link>
            <Link href="/projects" className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-500">
              Lihat Portofolio
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Pendekatan lokal</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">Desain yang memahami karakter {location.city}</h2>
          </div>
          <p className="text-base leading-8 text-neutral-600">{location.localContext}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Layanan</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">Dari konsep hingga siap diwujudkan</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {location.services.map((service) => (
            <article key={service} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-semibold text-neutral-950">{service}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Pendekatan terukur untuk menghasilkan desain yang estetis, fungsional, dan sesuai kebutuhan proyek.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">Proses</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Cara kami bekerja</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {location.process.map((step, index) => (
              <div key={step} className="border-t border-neutral-700 pt-5">
                <span className="text-sm text-neutral-500">0{index + 1}</span>
                <h3 className="mt-3 font-medium">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">Pertanyaan tentang jasa arsitek di {location.city}</h2>
        <div className="mt-8 divide-y divide-neutral-200">
          {location.faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-medium text-neutral-950">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center sm:px-8 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Punya rencana membangun atau merenovasi?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-600">Ceritakan kebutuhan proyek Anda. Kami bantu mulai dari konsultasi dan konsep desain.</p>
          <Link href="/contact" className="mt-7 inline-flex rounded-full bg-neutral-950 px-7 py-3 text-sm font-medium text-white">Mulai Konsultasi</Link>
        </div>
      </section>
    </main>
  );
}
