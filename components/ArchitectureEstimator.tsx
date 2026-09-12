"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectType = "Rumah Baru" | "Renovasi" | "Villa" | "Commercial";
type DesignLevel = "Essential" | "Signature" | "Premium";

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
  Commercial: "Commercial",
};

const DESIGN_LABELS: Record<DesignLevel, string> = {
  Essential: "Essential",
  Signature: "Signature",
  Premium: "Premium",
};

export const ESTIMATOR_LEAD_CONTEXT_KEY =
  "rumah-arsitek-estimator-lead-context-v1";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ArchitectureEstimator() {
  const [projectType, setProjectType] = useState<ProjectType>("Rumah Baru");
  const [designLevel, setDesignLevel] = useState<DesignLevel>("Signature");
  const [area, setArea] = useState<number>(FALLBACK_SETTINGS.min_area);
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
    const safeArea = Math.max(settings.min_area, Number(area) || settings.min_area);
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
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3f3f]">Architecture Estimator</div>
            <h2 className="max-w-xl font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-black sm:text-5xl">Dapatkan gambaran<span className="block text-[#454545]">investasi desain Anda.</span></h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#3f3f3f]">Gunakan estimator ini sebagai gambaran awal biaya jasa desain arsitektur. Nilai akhir dapat berubah sesuai kompleksitas, kondisi lokasi, kebutuhan ruang, dan lingkup pekerjaan.</p>
            <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4a4a4a]">Catatan</p>
              <p className="mt-2 text-sm leading-6 text-[#444444]">Estimasi dihitung berdasarkan luas bangunan × rate desain × multiplier jenis proyek.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:p-7">
            <div>
              <label className="text-sm font-semibold text-black">Jenis proyek</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(Object.keys(PROJECT_LABELS) as ProjectType[]).map((type) => {
                  const active = projectType === type;
                  return <button key={type} type="button" onClick={() => setProjectType(type)} className={["rounded-xl border px-4 py-3 text-left text-sm font-semibold transition", active ? "border-black bg-black text-white" : "border-black/10 bg-white text-[#333333] hover:border-black/30"].join(" ")}>{PROJECT_LABELS[type]}</button>;
                })}
              </div>
            </div>

            <div className="mt-7">
              <label className="text-sm font-semibold text-black">Paket desain</label>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(Object.keys(DESIGN_LABELS) as DesignLevel[]).map((level) => {
                  const active = designLevel === level;
                  return <button key={level} type="button" onClick={() => setDesignLevel(level)} className={["rounded-xl border px-4 py-3 text-left text-sm font-semibold transition", active ? "border-[#255c45] bg-[#255c45] text-white" : "border-black/10 bg-white text-[#333333] hover:border-black/30"].join(" ")}>{DESIGN_LABELS[level]}</button>;
                })}
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between"><label htmlFor="estimator-area" className="text-sm font-semibold text-black">Luas bangunan</label><span className="text-sm font-bold text-black">{calculation.area} m²</span></div>
              <div className="mt-3 flex items-center gap-3">
                <input id="estimator-area" type="range" min={settings.min_area} max="1000" step="5" value={Math.min(1000, Math.max(settings.min_area, calculation.area))} onChange={(event) => setArea(Number(event.target.value))} className="w-full accent-[#255c45]" />
                <input type="number" min={settings.min_area} value={area} onChange={(event) => setArea(Number(event.target.value))} className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-center text-sm font-semibold text-black outline-none focus:border-black/40" />
              </div>
              <p className="mt-2 text-xs text-[#555555]">Minimum luas: {settings.min_area} m²</p>
            </div>

            <div className="mt-8 rounded-2xl bg-black p-5 text-white sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">Estimasi investasi</p><p className="mt-2 text-sm text-white/90">{calculation.area} m² · {projectType} · {designLevel}</p></div>
                {loadingSettings && <span className="text-xs text-white/90">Memuat...</span>}
              </div>
              <div className="mt-6"><p className="text-3xl font-bold tracking-tight sm:text-4xl">{formatRupiah(calculation.min)}</p><div className="my-2 text-sm text-white/90">sampai</div><p className="text-3xl font-bold tracking-tight sm:text-4xl">{formatRupiah(calculation.max)}</p></div>
              <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/90">Angka ini merupakan estimasi awal, bukan quotation final.</div>
            </div>

            <button type="button" onClick={continueToConsultation} className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#255c45] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#1d4c39]">Konsultasikan proyek Anda</button>
          </div>
        </div>
      </div>
    </section>
  );
}
