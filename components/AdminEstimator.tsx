"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type DesignSetting = {
  id: string;
  design_level: string;
  design_label: string;
  design_description: string | null;
  rate_per_m2: number;
};

type ProjectTypeSetting = {
  id: string;
  project_type: string;
  project_label: string;
  multiplier: number;
};

type EstimatorConfig = {
  id: string;
  min_area: number;
  min_range_percent: number;
  max_range_percent: number;
};

type Data = {
  settings: DesignSetting[];
  projectTypes: ProjectTypeSetting[];
  config: EstimatorConfig | null;
};

function rupiah(value: number) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export default function AdminEstimator() {
  const [data, setData] =
    useState<Data | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [previewArea, setPreviewArea] =
    useState(120);

  const [previewProject, setPreviewProject] =
    useState("");

  const [previewDesign, setPreviewDesign] =
    useState("");

  async function load() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/admin/estimator",
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data."
        );
      }

      const result =
        (await response.json()) as Data;

      setData(result);

      if (
        result.projectTypes.length
      ) {
        setPreviewProject(
          result.projectTypes[0]
            .project_type
        );
      }

      if (
        result.settings.length
      ) {
        const signature =
          result.settings.find(
            (item) =>
              item.design_level ===
              "Signature"
          );

        setPreviewDesign(
          signature?.design_level ||
            result.settings[0]
              .design_level
        );
      }
    } catch (error) {
      console.error(
        "[ADMIN ESTIMATOR]",
        error
      );

      setMessage(
        "Gagal memuat estimator."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveDesign(
    item: DesignSetting
  ) {
    setSaving(item.id);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/estimator",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              type:
                "design_setting",

              id: item.id,

              rate_per_m2:
                item.rate_per_m2,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Gagal menyimpan."
        );
      }

      setMessage(
        `${item.design_label} berhasil disimpan.`
      );

      await load();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan."
      );
    } finally {
      setSaving(null);
    }
  }

  async function saveProjectType(
    item: ProjectTypeSetting
  ) {
    setSaving(item.id);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/estimator",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              type:
                "project_type",

              id: item.id,

              multiplier:
                item.multiplier,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Gagal menyimpan."
        );
      }

      setMessage(
        `${item.project_label} berhasil disimpan.`
      );

      await load();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan."
      );
    } finally {
      setSaving(null);
    }
  }

  async function saveConfig() {
    if (!data?.config) return;

    setSaving("config");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/estimator",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              type:
                "global_config",

              min_area:
                data.config.min_area,

              min_range_percent:
                data.config
                  .min_range_percent,

              max_range_percent:
                data.config
                  .max_range_percent,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Gagal menyimpan."
        );
      }

      setMessage(
        "Konfigurasi estimator berhasil disimpan."
      );

      await load();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan."
      );
    } finally {
      setSaving(null);
    }
  }

  const preview = useMemo(() => {
    if (
      !data ||
      !data.config
    ) {
      return {
        base: 0,
        min: 0,
        max: 0,
      };
    }

    const project =
      data.projectTypes.find(
        (item) =>
          item.project_type ===
          previewProject
      );

    const design =
      data.settings.find(
        (item) =>
          item.design_level ===
          previewDesign
      );

    if (!project || !design) {
      return {
        base: 0,
        min: 0,
        max: 0,
      };
    }

    const area = Math.max(
      Number(
        data.config.min_area
      ) || 20,
      Number(previewArea) || 20
    );

    const base =
      area *
      Number(
        design.rate_per_m2
      ) *
      Number(
        project.multiplier
      );

    return {
      base,

      min:
        base *
        Number(
          data.config
            .min_range_percent
        ),

      max:
        base *
        Number(
          data.config
            .max_range_percent
        ),
    };
  }, [
    data,
    previewArea,
    previewProject,
    previewDesign,
  ]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8">
        Memuat konfigurasi estimator...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
        Data estimator tidak tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Estimator Settings
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Pengaturan Estimator
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Atur tarif, multiplier, dan
          formula estimasi langsung dari
          dashboard tanpa mengubah kode.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {message}
        </div>
      )}

      {/* DESIGN RATES */}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-900">
            Tarif Paket Desain
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Harga dasar per meter persegi.
          </p>
        </div>

        <div className="space-y-4">
          {data.settings.map(
            (item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-xl border border-zinc-200 p-4 sm:grid-cols-[1fr_240px_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-zinc-900">
                    {item.design_label}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {item.design_description ||
                      "Paket desain"}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Tarif / m²
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      item.rate_per_m2
                    }
                    onChange={(event) => {
                      const value =
                        Number(
                          event.target.value
                        );

                      setData(
                        (current) =>
                          current
                            ? {
                                ...current,
                                settings:
                                  current.settings.map(
                                    (
                                      setting
                                    ) =>
                                      setting.id ===
                                      item.id
                                        ? {
                                            ...setting,
                                            rate_per_m2:
                                              value,
                                          }
                                        : setting
                                  ),
                              }
                            : current
                      );
                    }}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <button
                  type="button"
                  disabled={
                    saving === item.id
                  }
                  onClick={() =>
                    saveDesign(item)
                  }
                  className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving === item.id
                    ? "Menyimpan..."
                    : "Simpan"}
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* PROJECT MULTIPLIERS */}

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-900">
            Multiplier Jenis Proyek
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Faktor pengali berdasarkan
            jenis proyek.
          </p>
        </div>

        <div className="space-y-4">
          {data.projectTypes.map(
            (item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-xl border border-zinc-200 p-4 sm:grid-cols-[1fr_200px_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-zinc-900">
                    {item.project_label}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Contoh: 1.15 berarti
                    +15%.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Multiplier
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      item.multiplier
                    }
                    onChange={(event) => {
                      const value =
                        Number(
                          event.target.value
                        );

                      setData(
                        (current) =>
                          current
                            ? {
                                ...current,
                                projectTypes:
                                  current.projectTypes.map(
                                    (
                                      project
                                    ) =>
                                      project.id ===
                                      item.id
                                        ? {
                                            ...project,
                                            multiplier:
                                              value,
                                          }
                                        : project
                                  ),
                              }
                            : current
                      );
                    }}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <button
                  type="button"
                  disabled={
                    saving === item.id
                  }
                  onClick={() =>
                    saveProjectType(
                      item
                    )
                  }
                  className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving === item.id
                    ? "Menyimpan..."
                    : "Simpan"}
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* GLOBAL CONFIG */}

      {data.config && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900">
              Formula Global
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Parameter utama perhitungan
              estimasi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                Minimum luas (m²)
              </label>

              <input
                type="number"
                min="1"
                value={
                  data.config.min_area
                }
                onChange={(event) =>
                  setData(
                    (current) =>
                      current
                        ? {
                            ...current,
                            config:
                              current.config
                                ? {
                                    ...current.config,
                                    min_area:
                                      Number(
                                        event.target
                                          .value
                                      ),
                                  }
                                : null,
                          }
                        : current
                  )
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-3 text-sm font-semibold text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                Range minimum
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                value={
                  data.config
                    .min_range_percent
                }
                onChange={(event) =>
                  setData(
                    (current) =>
                      current
                        ? {
                            ...current,
                            config:
                              current.config
                                ? {
                                    ...current.config,
                                    min_range_percent:
                                      Number(
                                        event.target
                                          .value
                                      ),
                                  }
                                : null,
                          }
                        : current
                  )
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-3 text-sm font-semibold text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />

              <p className="mt-1 text-xs text-zinc-400">
                0.85 = 85%
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                Range maksimum
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                value={
                  data.config
                    .max_range_percent
                }
                onChange={(event) =>
                  setData(
                    (current) =>
                      current
                        ? {
                            ...current,
                            config:
                              current.config
                                ? {
                                    ...current.config,
                                    max_range_percent:
                                      Number(
                                        event.target
                                          .value
                                      ),
                                  }
                                : null,
                          }
                        : current
                  )
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-3 text-sm font-semibold text-zinc-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />

              <p className="mt-1 text-xs text-zinc-400">
                1.25 = 125%
              </p>
            </div>

          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={
                saving === "config"
              }
              onClick={saveConfig}
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving === "config"
                ? "Menyimpan..."
                : "Simpan Formula"}
            </button>
          </div>
        </section>
      )}

      {/* LIVE PREVIEW */}

      <section className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm sm:p-6">

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Live Preview
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Simulasi Formula
          </h3>

          <p className="mt-1 text-sm text-white/60">
            Cek hasil perubahan parameter
            sebelum digunakan pengunjung.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-xs text-white/60">
              Luas
            </label>

            <input
              type="number"
              min="1"
              value={previewArea}
              onChange={(event) =>
                setPreviewArea(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/60">
              Jenis proyek
            </label>

            <select
              value={previewProject}
              onChange={(event) =>
                setPreviewProject(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-white outline-none"
            >
              {data.projectTypes.map(
                (item) => (
                  <option
                    key={item.id}
                    value={
                      item.project_type
                    }
                    className="bg-zinc-950"
                  >
                    {item.project_label}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/60">
              Paket desain
            </label>

            <select
              value={previewDesign}
              onChange={(event) =>
                setPreviewDesign(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-white outline-none"
            >
              {data.settings.map(
                (item) => (
                  <option
                    key={item.id}
                    value={
                      item.design_level
                    }
                    className="bg-zinc-950"
                  >
                    {item.design_label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">

          <p className="text-xs uppercase tracking-wider text-white/50">
            Estimasi
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">

            <div>
              <p className="text-2xl font-semibold text-[#f0dcb9]">
                {rupiah(
                  preview.min
                )}
              </p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-[#f0dcb9]">
                {rupiah(
                  preview.max
                )}
              </p>
            </div>

          </div>

          <p className="mt-3 text-xs text-white/50">
            Formula: luas × tarif paket ×
            multiplier proyek × range.
          </p>
        </div>
      </section>
    </div>
  );
}