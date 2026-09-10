"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  photo_url: string | null;
  position: string;
  bio: string;
  skills: string[];
  sort_order: number;
  published: boolean;
};

type FormState = Omit<TeamMember, "id">;

const emptyForm: FormState = {
  name: "",
  photo_url: "",
  position: "",
  bio: "",
  skills: [],
  sort_order: 0,
  published: true,
};

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/team", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengambil data team.");
      setMembers(data.team || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data team.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSkillInput("");
    setError("");
    setMessage("");
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      photo_url: member.photo_url || "",
      position: member.position,
      bio: member.bio || "",
      skills: Array.isArray(member.skills) ? member.skills : [],
      sort_order: member.sort_order,
      published: member.published,
    });
    setSkillInput("");
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill || form.skills.includes(skill) || form.skills.length >= 20) return;
    setForm((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setForm((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/team", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyimpan anggota team.");
      setMessage(editingId ? "Profil team berhasil diperbarui." : "Profil team berhasil ditambahkan.");
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan anggota team.");
    } finally {
      setSaving(false);
    }
  }

  async function removeMember(id: string) {
    if (deletingId) return;
    if (!window.confirm("Hapus anggota team ini? Data yang dihapus tidak dapat dikembalikan.")) return;
    setDeletingId(id);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghapus anggota team.");
      setMembers((current) => current.filter((member) => member.id !== id));
      setMessage("Anggota team berhasil dihapus.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus anggota team.");
    } finally {
      setDeletingId(null);
    }
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4d6b52]">RUMAH ARSITEK</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Team CMS</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">Kelola profil anggota team yang tampil di website. Data ini terpisah dari akun login Admin dan Editor.</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d5d0c7] bg-white px-4 py-2 text-xs font-medium hover:bg-[#faf9f6] disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      {(error || message) && <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"}`}>{error || message}</div>}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={save} className="rounded-2xl border border-[#d5d0c7] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-semibold">{editingId ? "Edit profil" : "Tambah anggota"}</h2><p className="mt-1 text-xs text-black/45">Informasi publik, bukan kredensial login.</p></div>
            {editingId && <button type="button" onClick={startCreate} className="rounded-full p-2 hover:bg-[#f4f2ed]" aria-label="Batal edit"><X size={16} /></button>}
          </div>

          <div className="mt-5 grid gap-4">
            <div><label className="mb-2 block text-xs font-medium">Nama *</label><input required maxLength={120} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nama lengkap" className="w-full rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /></div>
            <div><label className="mb-2 block text-xs font-medium">Jabatan *</label><input required maxLength={120} value={form.position} onChange={(e) => update("position", e.target.value)} placeholder="Principal Architect" className="w-full rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /></div>
            <div><label className="mb-2 block text-xs font-medium">URL foto</label><div className="flex gap-2"><input type="url" value={form.photo_url} onChange={(e) => update("photo_url", e.target.value)} placeholder="https://..." className="min-w-0 flex-1 rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#c9c3b8] text-black/35"><ImagePlus size={17} /></div></div><p className="mt-1 text-[11px] text-black/40">Upload langsung ke Storage bisa ditambahkan setelah alur CMS dasar stabil.</p></div>
            <div><label className="mb-2 block text-xs font-medium">Bio</label><textarea maxLength={2000} rows={5} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Profil singkat, pengalaman, dan pendekatan desain..." className="w-full resize-y rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /></div>
            <div><label className="mb-2 block text-xs font-medium">Keahlian</label><div className="flex gap-2"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Contoh: Residential" className="min-w-0 flex-1 rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /><button type="button" onClick={addSkill} className="rounded-xl border border-[#d5d0c7] px-3" aria-label="Tambah keahlian"><Plus size={16} /></button></div><div className="mt-2 flex flex-wrap gap-2">{form.skills.map((skill) => <button key={skill} type="button" onClick={() => removeSkill(skill)} className="rounded-full bg-[#f0eee8] px-3 py-1.5 text-[11px]" title="Hapus keahlian">{skill} ×</button>)}</div></div>
            <div className="grid grid-cols-2 gap-3"><div><label className="mb-2 block text-xs font-medium">Urutan</label><input type="number" min={0} max={9999} value={form.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} className="w-full rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm" /></div><label className="flex items-end gap-2 rounded-xl border border-[#d5d0c7] px-3 py-3 text-xs"><input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Tampilkan di website</label></div>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#181817] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50">{saving ? "Menyimpan..." : editingId ? "Simpan perubahan" : "Tambah anggota"}</button>
          </div>
        </form>

        <div className="rounded-2xl border border-[#d5d0c7] bg-white">
          <div className="border-b border-[#d5d0c7] px-5 py-4"><h2 className="font-semibold">Anggota team</h2><p className="mt-1 text-xs text-black/45">Urutan tampil mengikuti nilai Urutan dari terkecil ke terbesar.</p></div>
          {loading ? <div className="p-6 text-sm text-black/45">Memuat team...</div> : members.length === 0 ? <div className="p-8 text-center text-sm text-black/45">Belum ada anggota team. Tambahkan profil pertama dari panel di samping.</div> : <div className="divide-y divide-[#ece8e1]">{members.map((member) => <article key={member.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#eeeae2] text-xs text-black/35">{member.photo_url ? <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" /> : "NO PHOTO"}</div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{member.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${member.published ? "bg-green-100 text-green-800" : "bg-black/5 text-black/45"}`}>{member.published ? "Tampil" : "Disembunyikan"}</span></div><p className="mt-1 text-xs font-medium text-[#4d6b52]">{member.position}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-black/50">{member.bio || "Belum ada bio."}</p><div className="mt-2 flex flex-wrap gap-1.5">{(member.skills || []).slice(0, 5).map((skill) => <span key={skill} className="rounded-full border border-[#d5d0c7] px-2 py-1 text-[10px]">{skill}</span>)}<span className="rounded-full border border-[#d5d0c7] px-2 py-1 text-[10px]">Urutan {member.sort_order}</span></div></div>
            <div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(member)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5d0c7] px-3 py-2 text-xs"><Pencil size={13} /> Edit</button><button type="button" disabled={deletingId === member.id} onClick={() => removeMember(member.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700 disabled:opacity-50"><Trash2 size={13} /> {deletingId === member.id ? "..." : "Hapus"}</button></div>
          </article>)}</div>}
        </div>
      </div>
    </section>
  );
}
