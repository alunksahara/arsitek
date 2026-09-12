"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectType = "Rumah Baru" | "Renovasi" | "Villa" | "Commercial";
type DesignLevel = "Essential" | "Signature" | "Premium";
type Condition =
  | "Lahan kosong"
  | "Persiapan pembangunan"
  | "Bangunan existing"
  | "Sebagian direnovasi"
  | "Renovasi total";
type Timeline = "Segera" | "1–3 bulan" | "3–6 bulan" | ">6 bulan" | "Masih eksplorasi";

type EstimatorSettings = {
  essential_rate: number;
  signature_rate: number;
  premium_rate: number;
  rumah_baru_multiplier: number;
  renovasi_multiplier: number;
  villa_multiplier: number;
  commercial_multiplier: number;
  min_range_multiplier: number;
  max_range_multiplier: number;
  min_area: number;
};

const FALLBACK_SETTINGS: EstimatorSettings = {
  essential_rate: 180000,
  signature_rate: 300000,
  premium_rate: 450000,
  rumah_baru_multiplier: 1,
  renovasi_multiplier: 1.15,
  villa_multiplier: 1.2,
  commercial_multiplier: 1.3,
  min_range_multiplier: 0.85,
  max_range_multiplier: 1.25,
  min_area: 20,
};

const PROJECT_LABELS: Record<ProjectType, string> = {
  "Rumah Baru": "Rumah Baru",
  Renovasi: "Renovasi",
  Villa: "Villa",
  Commercial: "Ruang Usaha",
};

const DESIGN_LABELS: Record<DesignLevel, string> = {
  Essential: "Essential",
  Signature: "Signature",
  Premium: "Premium",
};

const NEED_OPTIONS = [
  "Konsep & denah",
  "Desain arsitektur",
  "Desain interior",
  "Desain fasad",
  "Visualisasi 3D",
  "Gambar kerja",
  "Perencanaan ruang",
  "Renovasi & pengembangan",
  "Paket desain lengkap",
] as const;

export const ESTIMATOR_LEAD_CONTEXT_KEY =
  "rumah-arsitek-estimator-lead-context-v1";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function sanitizeArea(value: number, minimum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(10000, Math.round(value)));
}

export default function ArchitectureEstimator() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType>("Rumah Baru");
  const [designLevel, setDesignLevel] = useState<DesignLevel>("Signature");
  const [area, setArea] = useState(FALLBACK_SETTINGS.min_area);
  const [landArea, setLandArea] = useState("");
  const [floors, setFloors] = useState("1");
  const [condition, setCondition] = useState<Condition>("Lahan kosong");
  const [needs, setNeeds] = useState<string[]>(["Desain arsitektur"]);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [timeline, setTimeline] = useState<Timeline>("1–3 bulan");
  const [settings, setSettings] = useState<EstimatorSettings>(FALLBACK_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const response = await fetch("/api/estimator", { method: "GET", cache: "no-store" });
        if (!response.ok) throw new Error("Gagal mengambil estimator settings");
        const result = await response.json();
        if (mounted && result?.settings) {
          setSettings({
            essential_rate: Number(result.settings.essential_rate),
            signature_rate: Number(result.settings.signature_rate),
            premium_rate: Number(result.settings.premium_rate),
            rumah_baru_multiplier: Number(result.settings.rumah_baru_multiplier),
            renovasi_multiplier: Number(result.settings.renovasi_multiplier),
            villa_multiplier: Number(result.settings.villa_multiplier),
            commercial_multiplier: Number(result.settings.commercial_multiplier),
            min_range_multiplier: Number(result.settings.min_range_multiplier),
            max_range_multiplier: Number(result.settings.max_range_multiplier),
            min_area: Number(result.settings.min_area),
          });
        }
      } catch (error) {
        console.error("[ESTIMATOR SETTINGS]", error);
      } finally {
        if (mounted) setLoadingSettings(false);
      }
    }
    loadSettings();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (area < settings.min_area || !Number.isFinite(area)) setArea(settings.min_area);
  }, [settings.min_area, area]);

  const calculation = useMemo(() => {
    const safeArea = sanitizeArea(area, settings.min_area);
    const rates: Record<DesignLevel, number> = {
      Essential: settings.essential_rate,
      Signature: settings.signature_rate,
      Premium: settings.premium_rate,
    };
    const multipliers: Record<ProjectType, number> = {
      "Rumah Baru": settings.rumah_baru_multiplier,
      Renovasi: settings.renovasi_multiplier,
      Villa: settings.villa_multiplier,
      Commercial: settings.commercial_multiplier,
    };
    const base = safeArea * rates[designLevel] * multipliers[projectType];
    return {
      area: safeArea,
      base,
      min: base * settings.min_range_multiplier,
      max: base * settings.max_range_multiplier,
    };
  }, [area, designLevel, projectType, settings]);

  const canNext = () => {
    if (step === 2) return calculation.area >= settings.min_area;
    if (step === 3) return needs.length > 0;
    if (step === 5) return city.trim().length > 0 && province.trim().length > 0;
    return true;
  };

  function toggleNeed(value: string) {
    setNeeds((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function nextStep() {
    if (!canNext()) return;
    setStep((current) => Math.min(6, current + 1));
  }

  function previousStep() {
    setStep((current) => Math.max(1, current - 1));
  }

  function continueToConsultation() {
    try {
      sessionStorage.setItem(
        ESTIMATOR_LEAD_CONTEXT_KEY,
        JSON.stringify({
          projectType,
          designLevel,
          area: calculation.area,
          estimatedMin: Math.round(calculation.min),
          estimatedMax: Math.round(calculation.max),
          landArea: landArea ? Number(landArea) : null,
          floors: Number(floors) || 1,
          condition,
          needs,
          city: city.trim(),
          province: province.trim(),
          timeline,
        })
      );
    } catch (error) {
      console.error("[ESTIMATOR LEAD CONTEXT]", error);
    }
    window.location.href = "/contact";
  }

  return (
    <section id="estimator" className="relative overflow-hidden bg-[#f4efe5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3f3f]">Project Planning Estimator</div>
            <h2 className="max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-black sm:text-5xl">Rencanakan proyek<span className="block text-[#454545]">sebelum melangkah.</span></h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#3f3f3f]">Jawab beberapa pertanyaan sederhana untuk mendapatkan gambaran awal investasi desain sekaligus merangkum kebutuhan proyek Anda.</p>
            <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4a4a4a]">Yang akan Anda dapatkan</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[#444444]">
                <li>• Kisaran estimasi investasi desain</li>
                <li>• Ringkasan kebutuhan proyek</li>
                <li>• Brief yang bisa langsung dikonsultasikan</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#255c45]">Langkah {step} dari 6</p>
                <p className="mt-1 text-sm text-[#666]">{step === 6 ? "Periksa kembali brief Anda" : "Isi sesuai gambaran yang Anda miliki"}</p>
              </div>
              <div className="flex gap-1" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6].map((item) => <span key={item} className={`h-1.5 w-6 rounded-full ${item <= step ? "bg-[#255c45]" : "bg-black/10"}`} />)}
              </div>
            </div>

            {step === 1 && (
              <div>
                <h3 className="text-2xl font-semibold">Apa yang ingin Anda wujudkan?</h3>
                <p className="mt-2 text-sm leading-6 text-[#666]">Pilih jenis proyek yang paling mendekati kebutuhan Anda.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {(Object.keys(PROJECT_LABELS) as ProjectType[]).map((type) => {
                    const active = projectType === type;
                    return <button key={type} type="button" onClick={() => setProjectType(type)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-black bg-black text-white" : "border-black/10 hover:border-black/30"}`}><span className="text-sm font-semibold">{PROJECT_LABELS[type]}</span><span className="mt-1 block text-xs opacity-70">{type === "Commercial" ? "Kantor, cafe, toko, klinik, dan lainnya" : type}</span></button>;
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-2xl font-semibold">Ukuran & kondisi proyek</h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <div className="flex items-center justify-between"><label htmlFor="estimator-area" className="text-sm font-semibold">Luas bangunan</label><span className="text-sm font-bold">{calculation.area} m²</span></div>
                    <div className="mt-3 flex items-center gap-3"><input id="estimator-area" type="range" min={settings.min_area} max="1000" step="5" value={Math.min(1000, calculation.area)} onChange={(event) => setArea(Number(event.target.value))} className="w-full accent-[#255c45]" /><input type="number" min={settings.min_area} value={area} onChange={(event) => setArea(Number(event.target.value))} className="w-24 rounded-xl border border-black/10 px-3 py-2 text-center text-sm font-semibold outline-none" /></div>
                    <p className="mt-2 text-xs text-[#666]">Minimum {settings.min_area} m².</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold">Luas tanah <span className="font-normal text-[#888]">(opsional)</span><input type="number" min="1" value={landArea} onChange={(event) => setLandArea(event.target.value)} placeholder="Contoh 180" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none" /></label>
                    <label className="text-sm font-semibold">Jumlah lantai<select value={floors} onChange={(event) => setFloors(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none"><option value="1">1 lantai</option><option value="2">2 lantai</option><option value="3">3 lantai</option><option value="4">4+ lantai</option></select></label>
                  </div>
                  <label className="block text-sm font-semibold">Kondisi proyek<select value={condition} onChange={(event) => setCondition(event.target.value as Condition)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none">{(projectType === "Rumah Baru" ? ["Lahan kosong", "Persiapan pembangunan", "Bangunan existing"] : ["Bangunan existing", "Sebagian direnovasi", "Renovasi total"]).map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-2xl font-semibold">Apa yang Anda butuhkan?</h3>
                <p className="mt-2 text-sm leading-6 text-[#666]">Boleh pilih lebih dari satu. Data ini membantu menyiapkan brief dan matching profesional.</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {NEED_OPTIONS.map((item) => <button key={item} type="button" onClick={() => toggleNeed(item)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${needs.includes(item) ? "border-[#255c45] bg-[#255c45] text-white" : "border-black/10 hover:border-black/30"}`}>{needs.includes(item) ? "✓ " : ""}{item}</button>)}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-2xl font-semibold">Pilih level layanan</h3>
                <p className="mt-2 text-sm leading-6 text-[#666]">Level ini menentukan rate dasar estimator. Lingkup akhir tetap dikonfirmasi saat konsultasi.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {(Object.keys(DESIGN_LABELS) as DesignLevel[]).map((level) => {
                    const active = designLevel === level;
                    const descriptions = { Essential: "Kebutuhan dasar dan efisien", Signature: "Desain lebih lengkap dan personal", Premium: "Kebutuhan desain yang lebih menyeluruh" };
                    return <button key={level} type="button" onClick={() => setDesignLevel(level)} className={`rounded-2xl border p-5 text-left transition ${active ? "border-[#255c45] bg-[#255c45] text-white" : "border-black/10 hover:border-black/30"}`}><span className="font-semibold">{level}</span><span className="mt-2 block text-xs leading-5 opacity-75">{descriptions[level]}</span></button>;
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h3 className="text-2xl font-semibold">Lokasi & rencana mulai</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">Kota / Kabupaten<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Contoh Kediri" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none" /></label>
                  <label className="text-sm font-semibold">Provinsi<input value={province} onChange={(event) => setProvince(event.target.value)} placeholder="Contoh Jawa Timur" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none" /></label>
                </div>
                <div className="mt-6"><span className="text-sm font-semibold">Kapan Anda berencana memulai?</span><div className="mt-3 grid gap-2 sm:grid-cols-2">{["Segera", "1–3 bulan", "3–6 bulan", ">6 bulan", "Masih eksplorasi"].map((item) => <button key={item} type="button" onClick={() => setTimeline(item as Timeline)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${timeline === item ? "border-black bg-black text-white" : "border-black/10 hover:border-black/30"}`}>{item}</button>)}</div></div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h3 className="text-2xl font-semibold">Review rencana proyek</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Proyek", PROJECT_LABELS[projectType]],
                    ["Luas bangunan", `${calculation.area} m²`],
                    ["Luas tanah", landArea ? `${landArea} m²` : "Belum diisi"],
                    ["Lantai", `${floors === "4" ? "4+" : floors} lantai`],
                    ["Kondisi", condition],
                    ["Paket", designLevel],
                    ["Lokasi", city && province ? `${city}, ${province}` : "Belum lengkap"],
                    ["Mulai", timeline],
                  ].map(([label, value]) => <div key={label} className="rounded-xl border border-black/10 bg-[#faf9f6] p-4"><span className="text-xs text-[#777]">{label}</span><p className="mt-1 text-sm font-semibold">{value}</p></div>)}
                </div>
                <div className="mt-3 rounded-xl border border-black/10 bg-[#faf9f6] p-4"><span className="text-xs text-[#777]">Kebutuhan</span><p className="mt-1 text-sm font-semibold">{needs.join(" · ")}</p></div>
                <div className="mt-6 rounded-2xl bg-black p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Perkiraan investasi desain</p><div className="mt-3 text-3xl font-bold sm:text-4xl">{formatRupiah(calculation.min)}</div><div className="my-1 text-sm text-white/60">sampai</div><div className="text-3xl font-bold sm:text-4xl">{formatRupiah(calculation.max)}</div><p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/70">Estimasi awal berdasarkan luas bangunan, rate paket, dan multiplier jenis proyek. Bukan quotation final.</p></div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={previousStep} disabled={step === 1} className="min-h-12 rounded-xl border border-black/10 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-30">← Kembali</button>
              {step < 6 ? <button type="button" onClick={nextStep} disabled={!canNext()} className="min-h-12 rounded-xl bg-[#255c45] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Lanjut →</button> : <button type="button" onClick={continueToConsultation} className="min-h-12 flex-1 rounded-xl bg-[#255c45] px-6 text-sm font-bold text-white sm:max-w-md">Konsultasikan estimasi ini →</button>}
            </div>
            {loadingSettings && <p className="mt-4 text-center text-xs text-[#777]">Memuat konfigurasi estimasi...</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
