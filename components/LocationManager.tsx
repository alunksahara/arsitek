"use client";

import { useEffect, useState } from "react";

type FAQ = { question: string; answer: string };
type Location = {
  id?: string;
  city: string;
  slug: string;
  province: string;
  seo_title: string;
  seo_description: string;
  h1: string;
  intro: string;
  local_context: string;
  services: string[];
  process: string[];
  faqs: FAQ[];
  published: boolean;
  sort_order: number;
};

const emptyLocation: Location = {
  city: "", slug: "", province: "Jawa Timur", seo_title: "", seo_description: "", h1: "", intro: "", local_context: "",
  services: ["Desain rumah tinggal", "Interior & eksterior", "Renovasi & pengembangan desain"],
  process: ["Konsultasi kebutuhan", "Konsep & eksplorasi desain", "Pengembangan gambar", "Persiapan menuju pelaksanaan"],
  faqs: [{ question: "", answer: "" }], published: true, sort_order: 0,
};

const inputClass = "mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900";

export default function LocationManager({ embedded = false }: { embedded?: boolean }) {
  const [items, setItems] = useState<Location[]>([]);
  const [form, setForm] = useState<Location>(emptyLocation);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/locations", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setItems(json.data || []);
    else setMessage(json.error || "Gagal memuat lokasi");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function edit(item: Location) {
    setForm({ ...item, services: item.services || [], process: item.process || [], faqs: item.faqs || [] });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() { setForm({ ...emptyLocation, services: [...emptyLocation.services], process: [...emptyLocation.process], faqs: [{ ...emptyLocation.faqs[0] }] }); setMessage(""); }

  function updateArray(key: "services" | "process", index: number, value: string) {
    setForm((f) => ({ ...f, [key]: f[key].map((v, i) => i === index ? value : v) }));
  }

  async function save() {
    setSaving(true); setMessage("");
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch("/api/locations", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = await res.json();
    if (!res.ok) { setMessage(json.error || "Gagal menyimpan"); setSaving(false); return; }
    setMessage("Lokasi berhasil disimpan.");
    reset(); await load(); setSaving(false);
  }

  async function remove(id?: string) {
    if (!id || !confirm("Hapus lokasi ini? Halaman publiknya juga akan hilang.")) return;
    const res = await fetch("/api/locations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || "Gagal menghapus"); else { setMessage("Lokasi dihapus."); await load(); if (form.id === id) reset(); }
  }

  const content = (
    <div className={embedded ? "" : "mx-auto max-w-7xl"}>
      {!embedded && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">RUMAH ARSITEK · CMS</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">Lokasi & SEO</h1><p className="mt-2 text-sm text-neutral-600">Tambah dan kelola halaman kota tanpa mengubah kode.</p></div>
          <a href="/admin" className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium">← Dashboard</a>
        </div>
      )}

      {message && <div className="mb-5 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">{message}</div>}

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">CMS / LOCAL SEO</p><h2 className="mt-1 text-xl font-semibold">{form.id ? "Edit lokasi" : "Tambah lokasi"}</h2></div>{form.id && <button onClick={reset} className="text-sm text-neutral-500">Batal edit</button>}</div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">Nama kota<input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Jombang" /></label>
          <label className="text-sm font-medium">Slug<input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="jasa-arsitek-jombang" /></label>
          <label className="text-sm font-medium">Provinsi<input className={inputClass} value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} /></label>
          <label className="text-sm font-medium">Urutan<input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></label>
          <label className="text-sm font-medium md:col-span-2">SEO Title<input className={inputClass} value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></label>
          <label className="text-sm font-medium md:col-span-2">SEO Description<textarea rows={3} className={inputClass} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></label>
          <label className="text-sm font-medium md:col-span-2">H1<input className={inputClass} value={form.h1} onChange={(e) => setForm({ ...form, h1: e.target.value })} /></label>
          <label className="text-sm font-medium md:col-span-2">Intro<textarea rows={4} className={inputClass} value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} /></label>
          <label className="text-sm font-medium md:col-span-2">Konteks lokal<textarea rows={5} className={inputClass} value={form.local_context} onChange={(e) => setForm({ ...form, local_context: e.target.value })} /></label>
        </div>

        <div className="mt-7 grid gap-7 md:grid-cols-2">
          <div><h3 className="font-semibold">Layanan</h3>{form.services.map((v, i) => <input key={i} className={inputClass} value={v} onChange={(e) => updateArray("services", i, e.target.value)} />)}<button onClick={() => setForm({ ...form, services: [...form.services, ""] })} className="mt-2 text-sm underline">+ Tambah layanan</button></div>
          <div><h3 className="font-semibold">Proses</h3>{form.process.map((v, i) => <input key={i} className={inputClass} value={v} onChange={(e) => updateArray("process", i, e.target.value)} />)}<button onClick={() => setForm({ ...form, process: [...form.process, ""] })} className="mt-2 text-sm underline">+ Tambah proses</button></div>
        </div>

        <div className="mt-7"><h3 className="font-semibold">FAQ</h3>{form.faqs.map((faq, i) => <div key={i} className="mt-3 grid gap-2 rounded-xl border border-neutral-200 p-3 md:grid-cols-2"><input className={inputClass} placeholder="Pertanyaan" value={faq.question} onChange={(e) => setForm({ ...form, faqs: form.faqs.map((x, j) => j === i ? { ...x, question: e.target.value } : x) })} /><textarea className={inputClass} placeholder="Jawaban" rows={2} value={faq.answer} onChange={(e) => setForm({ ...form, faqs: form.faqs.map((x, j) => j === i ? { ...x, answer: e.target.value } : x) })} /></div>)}<button onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: "", answer: "" }] })} className="mt-2 text-sm underline">+ Tambah FAQ</button></div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-200 pt-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish halaman</label><button disabled={saving} onClick={save} className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan Lokasi"}</button></div>
      </section>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-semibold">Lokasi aktif</h2>
        {loading ? <p className="mt-4 text-sm text-neutral-500">Memuat...</p> : <div className="mt-5 divide-y divide-neutral-200">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><div className="font-medium">{item.city}</div><div className="mt-1 text-xs text-neutral-500">/{item.slug} · {item.published ? "Published" : "Draft"}</div></div><div className="flex gap-2"><a target="_blank" rel="noreferrer" href={`/lokasi/${item.slug}`} className="rounded-full border border-neutral-300 px-3 py-2 text-xs">Lihat</a><button onClick={() => edit(item)} className="rounded-full border border-neutral-300 px-3 py-2 text-xs">Edit</button><button onClick={() => remove(item.id)} className="rounded-full border border-red-200 px-3 py-2 text-xs text-red-700">Hapus</button></div></div>)}</div>}
      </section>
    </div>
  );

  if (embedded) return content;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-10">
      {content}
    </main>
  );
}
