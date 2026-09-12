"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import Turnstile from "@/components/Turnstile";
import { ESTIMATOR_LEAD_CONTEXT_KEY } from "@/components/ArchitectureEstimator";

type EstimatorLeadContext = {
  projectType: string;
  designLevel: string;
  area: number;
  estimatedMin: number;
  estimatedMax: number;
  landArea?: number | null;
  floors?: number;
  condition?: string;
  needs?: string[];
  city?: string;
  province?: string;
  timeline?: string;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [projectType, setProjectType] = useState("");
  const [estimatorContext, setEstimatorContext] = useState<EstimatorLeadContext | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ESTIMATOR_LEAD_CONTEXT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EstimatorLeadContext;
      if (
        typeof parsed?.projectType === "string" &&
        typeof parsed?.designLevel === "string" &&
        Number.isFinite(Number(parsed?.area)) &&
        Number.isFinite(Number(parsed?.estimatedMin)) &&
        Number.isFinite(Number(parsed?.estimatedMax))
      ) {
        setEstimatorContext(parsed);
        setProjectType(parsed.projectType);
      }
    } catch (error) {
      console.error("[CONTACT ESTIMATOR CONTEXT]", error);
      sessionStorage.removeItem(ESTIMATOR_LEAD_CONTEXT_KEY);
    }
  }, []);

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const selectedProjectType = String(data.get("projectType") || projectType).trim();
    const budget = String(data.get("budget") || "").trim();
    const message = String(data.get("message") || "").trim();
    const turnstileToken = String(data.get("cf-turnstile-response") || "");

    try {
      const response = await fetch("/api/leads/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          projectType: selectedProjectType,
          budget,
          message,
          turnstileToken,
          estimatorContext,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
      if (whatsappNumber) {
        const whatsappMessage = [
          "Halo RUMAH ARSITEK, saya ingin melanjutkan konsultasi mengenai proyek saya.",
          "",
          `Nama: ${name}`,
          `WhatsApp: ${phone}`,
          `Email: ${email || "-"}`,
          `Jenis proyek: ${selectedProjectType || "-"}`,
          `Budget: ${budget || "-"}`,
          estimatorContext
            ? `Estimator: ${estimatorContext.area} m² · ${estimatorContext.designLevel} · ${formatRupiah(estimatorContext.estimatedMin)} – ${formatRupiah(estimatorContext.estimatedMax)}`
            : "",
          estimatorContext?.city
            ? `Lokasi: ${estimatorContext.city}${estimatorContext.province ? `, ${estimatorContext.province}` : ""}`
            : "",
          estimatorContext?.timeline
            ? `Target waktu: ${estimatorContext.timeline}`
            : "",
          "",
          `Detail proyek: ${message || "-"}`,
        ].filter(Boolean).join("\n");
        setWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`);
      }
      setSuccess(true);
      sessionStorage.removeItem(ESTIMATOR_LEAD_CONTEXT_KEY);
      setEstimatorContext(null);
      form.reset();
      setProjectType("");
    } catch (err) {
      console.error("[CONTACT FORM ERROR]", err);
      setError("Tidak dapat mengirim formulir. Periksa koneksi Anda lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1eb] py-8 md:py-16">
      <div className="container-main">
        <a href="/" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#343731]"><ArrowLeft size={15} aria-hidden="true" />Kembali</a>
        <div className="mx-auto mt-12 max-w-5xl md:mt-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#24563b]">Konsultasi proyek</p>
            <h1 className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[-0.05em] text-[#171715]">Ceritakan rencana<br /><i>ruang Anda.</i></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#77736c] md:text-lg">Ceritakan kebutuhan, jenis proyek, dan gambaran anggaran Anda. Informasi ini disimpan sebagai lead konsultasi agar tim dapat memahami kebutuhan Anda sebelum tindak lanjut.</p>
          </div>

          {estimatorContext && !success && (
            <div className="mt-8 border border-[#cfc9be] bg-white/70 p-5 md:mt-10 md:p-6">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#24563b]">Project brief dari Estimator</p>
                  <p className="mt-1 text-sm text-[#77736c]">Data ini akan ikut tercatat pada lead konsultasi.</p>
                </div>
                <span className="text-xs font-semibold text-[#77736c]">{estimatorContext.projectType}</span>
              </div>
              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><span className="text-[#77736c]">Paket · Luas bangunan</span><p className="font-semibold text-[#171715]">{estimatorContext.designLevel} · {estimatorContext.area} m²</p></div>
                <div><span className="text-[#77736c]">Rentang estimasi</span><p className="font-semibold text-[#171715]">{formatRupiah(estimatorContext.estimatedMin)} – {formatRupiah(estimatorContext.estimatedMax)}</p></div>
                <div><span className="text-[#77736c]">Luas tanah</span><p className="font-semibold text-[#171715]">{estimatorContext.landArea ? `${estimatorContext.landArea} m²` : "Belum diisi"}</p></div>
                <div><span className="text-[#77736c]">Lantai · Kondisi</span><p className="font-semibold text-[#171715]">{estimatorContext.floors || 1} lantai · {estimatorContext.condition || "-"}</p></div>
                <div><span className="text-[#77736c]">Lokasi</span><p className="font-semibold text-[#171715]">{estimatorContext.city || "-"}{estimatorContext.province ? `, ${estimatorContext.province}` : ""}</p></div>
                <div><span className="text-[#77736c]">Target waktu</span><p className="font-semibold text-[#171715]">{estimatorContext.timeline || "-"}</p></div>
              </div>
              {estimatorContext.needs?.length ? (
                <div className="mt-5 border-t border-[#d9d3ca] pt-4">
                  <span className="text-xs text-[#77736c]">Kebutuhan yang dipilih</span>
                  <p className="mt-1 text-sm leading-6 text-[#343731]">{estimatorContext.needs.join(" · ")}</p>
                </div>
              ) : null}
            </div>
          )}

          {success ? (
            <div className="mt-12 border border-[#cfc9be] bg-white/60 p-7 md:mt-16 md:p-10">
              <Check size={30} aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl text-[#171715] md:text-4xl">Konsultasi sudah tercatat.</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#77736c]">Data Anda sudah masuk ke sistem konsultasi RUMAH ARSITEK. WhatsApp adalah langkah lanjutan, bukan pengganti pencatatan lead.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center bg-[#24563b] px-6 text-xs font-bold uppercase tracking-[0.18em] text-white">Lanjut ke WhatsApp</a>}
                <a href="/" className="inline-flex min-h-12 items-center justify-center border border-[#171715] px-6 text-xs font-bold uppercase tracking-[0.18em]">Kembali ke beranda</a>
              </div>
            </div>
          ) : (
            <form onSubmit={submitForm} className="mt-10 grid gap-8 md:mt-14">
              <div className="grid gap-8 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">Nama lengkap<input name="name" required autoComplete="name" placeholder="Nama Anda" className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]" /></label>
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">WhatsApp / Telepon<input name="phone" required autoComplete="tel" inputMode="tel" placeholder="08xxxxxxxxxx" className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]" /></label>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">Email<input name="email" type="email" autoComplete="email" placeholder="nama@email.com" className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]" /></label>
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">Jenis proyek<select name="projectType" required value={projectType} onChange={(event) => setProjectType(event.target.value)} className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none focus:border-[#24563b]"><option value="" disabled>Pilih jenis proyek</option><option>Rumah baru</option><option>Renovasi</option><option>Interior</option><option>Komersial</option><option>Villa</option><option>Commercial</option><option>Lainnya</option></select></label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-[#343731]">Perkiraan anggaran<select name="budget" defaultValue="" className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none focus:border-[#24563b]"><option value="" disabled>Pilih kisaran anggaran</option><option>Di bawah Rp 500 juta</option><option>Rp 500 juta – Rp 1 miliar</option><option>Rp 1 – 2 miliar</option><option>Rp 2 – 5 miliar</option><option>Di atas Rp 5 miliar</option></select></label>
              <label className="grid gap-2 text-sm font-semibold text-[#343731]">Ceritakan proyek Anda<textarea name="message" rows={6} placeholder="Contoh: luas tanah, lokasi, kebutuhan ruang, gaya yang disukai, target waktu, atau hal lain yang penting bagi Anda." className="resize-y border border-[#cfc9be] bg-white/40 p-4 font-normal outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]" /></label>
              <div className="pt-1"><Turnstile /></div>
              {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="submit" disabled={loading} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#24563b] px-8 text-xs font-bold uppercase tracking-[0.18em] !text-white shadow-md transition hover:bg-[#173d29] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Mengirim..." : "Kirim konsultasi"}</button>
                <p className="max-w-md text-xs leading-5 text-[#77736c]">Lead disimpan terlebih dahulu. Setelah berhasil, Anda dapat memilih melanjutkan percakapan melalui WhatsApp.</p>
              </div>
            </form>
          )}
          <div className="mt-14 flex items-center gap-3 border-t border-[#cfc9be] pt-5 text-xs text-[#77736c] md:mt-20"><MessageCircle size={16} aria-hidden="true" />Konsultasi awal untuk proyek arsitektur, renovasi, dan interior.</div>
        </div>
      </div>
    </main>
  );
}
