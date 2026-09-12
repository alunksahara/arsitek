"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, RefreshCw, Save } from "lucide-react";

type Settings = {
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

const DEFAULTS: Settings = {
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

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function EstimatorAdminPanel() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/estimator", {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengambil konfigurasi estimator.");
      setSettings({ ...DEFAULTS, ...(data.settings || {}) });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengambil konfigurasi estimator.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(key: keyof Settings, value: string) {
    const number = Number(value);
    setSettings((current) => ({
      ...current,
      [key]: Number.isFinite(number) ? number : 0,
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/estimator", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan konfigurasi estimator.");
      setSettings({ ...DEFAULTS, ...(data.settings || {}) });
      setMessage("Konfigurasi tersimpan. Estimator publik sekarang memakai nilai yang sama.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan konfigurasi estimator.");
    } finally {
      setSaving(false);
    }
  }

  const preview = useMemo(() => {
    const area = Math.max(settings.min_area, 120);
    const base = area * settings.signature_rate * settings.rumah_baru_multiplier;
    return {
      min: base * settings.min_range_multiplier,
      max: base * settings.max_range_multiplier,
    };
  }, [settings]);

  const rateFields: [keyof Settings, string][] = [
    ["essential_rate", "Essential / m²"],
    ["signature_rate", "Signature / m²"],
    ["premium_rate", "Premium / m²"],
  ];

  const multiplierFields: [keyof Settings, string][] = [
    ["rumah_baru_multiplier", "Rumah Baru"],
    ["renovasi_multiplier", "Renovasi"],
    ["villa_multiplier", "Villa"],
    ["commercial_multiplier", "Commercial"],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#d5d0c7] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3ed] px-3 py-1.5 text-xs font-semibold text-[#2f6b4a]">
              <Calculator size={14} /> Estimator terpusat
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#181817] sm:text-3xl">
              Konfigurasi estimator RUMAH ARSITEK
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#454545]">
              Nilai di halaman ini disimpan ke Supabase. Tidak lagi bergantung pada localStorage browser, sehingga konfigurasi admin dan estimator publik menggunakan sumber data yang sama.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9c4bb] bg-white px-4 py-2.5 text-sm font-semibold text-[#252525] hover:bg-[#faf9f6] disabled:opacity-50"
          >
            <RefreshCw size={15} /> Muat ulang
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-4 py-3 text-sm font-medium text-[#333333]">
            {message}
          </div>
        )}

        <fieldset disabled={loading || saving} className="mt-7 space-y-7">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#3f4a43]">Tarif desain</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {rateFields.map(([key, label]) => (
                <label key={key} className="rounded-2xl border border-[#ded9d0] bg-[#faf9f6] p-4">
                  <span className="text-xs font-semibold text-[#454545]">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={settings[key]}
                    onChange={(event) => update(key, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#cfc9bf] bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#2f6b4a]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#3f4a43]">Multiplier jenis proyek</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {multiplierFields.map(([key, label]) => (
                <label key={key} className="rounded-2xl border border-[#ded9d0] bg-[#faf9f6] p-4">
                  <span className="text-xs font-semibold text-[#454545]">{label}</span>
                  <input
                    type="number"
                    min="0.01"
                    max="10"
                    step="0.01"
                    value={settings[key]}
                    onChange={(event) => update(key, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#cfc9bf] bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#2f6b4a]"
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#3f4a43]">Batas estimasi</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="rounded-2xl border border-[#ded9d0] bg-[#faf9f6] p-4">
                <span className="text-xs font-semibold text-[#454545]">Minimum luas (m²)</span>
                <input type="number" min="1" value={settings.min_area} onChange={(event) => update("min_area", event.target.value)} className="mt-2 w-full rounded-xl border border-[#cfc9bf] bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#2f6b4a]" />
              </label>
              <label className="rounded-2xl border border-[#ded9d0] bg-[#faf9f6] p-4">
                <span className="text-xs font-semibold text-[#454545]">Range minimum</span>
                <input type="number" min="0.01" step="0.01" value={settings.min_range_multiplier} onChange={(event) => update("min_range_multiplier", event.target.value)} className="mt-2 w-full rounded-xl border border-[#cfc9bf] bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#2f6b4a]" />
              </label>
              <label className="rounded-2xl border border-[#ded9d0] bg-[#faf9f6] p-4">
                <span className="text-xs font-semibold text-[#454545]">Range maksimum</span>
                <input type="number" min="0.01" step="0.01" value={settings.max_range_multiplier} onChange={(event) => update("max_range_multiplier", event.target.value)} className="mt-2 w-full rounded-xl border border-[#cfc9bf] bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#2f6b4a]" />
              </label>
            </div>
          </section>
        </fieldset>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-2xl bg-[#181817] p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">Preview 120 m² · Rumah Baru · Signature</div>
            <div className="mt-3 text-xl font-bold sm:text-2xl">{money(preview.min)} — {money(preview.max)}</div>
            <p className="mt-2 text-xs leading-5 text-white/90">Preview ini hanya untuk memastikan perubahan tarif dan range masuk akal sebelum disimpan.</p>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={loading || saving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#255c45] px-6 py-3 text-sm font-bold text-white hover:bg-[#1d4c39] disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Menyimpan..." : "Simpan ke Supabase"}
          </button>
        </div>
      </div>
    </div>
  );
}
