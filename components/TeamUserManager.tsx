"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";

type Role = "admin" | "editor";

type Profile = {
  id: string;
  email: string | null;
  role: Role;
  active: boolean;
  created_at: string;
  updated_at?: string;
};

export default function TeamUserManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProfiles() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/profiles", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengambil data user.");
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const stats = useMemo(() => ({
    total: profiles.length,
    active: profiles.filter((p) => p.active).length,
    admins: profiles.filter((p) => p.role === "admin" && p.active).length,
    editors: profiles.filter((p) => p.role === "editor" && p.active).length,
  }), [profiles]);

  async function inviteUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal mengundang user.");
      setEmail("");
      setMessage("Undangan berhasil dikirim. User dapat membuat password dari email undangan.");
      await loadProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengundang user.");
    } finally {
      setSaving(false);
    }
  }

  async function updateProfile(id: string, patch: Partial<Pick<Profile, "role" | "active">>) {
    setBusyId(id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/profiles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal memperbarui user.");
      setProfiles((current) => current.map((p) => p.id === id ? data.profile : p));
      setMessage("Perubahan user berhasil disimpan.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui user.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4d6b52]">RUMAH ARSITEK</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Team & User Management</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">Kelola siapa yang boleh masuk dashboard, tentukan role Admin atau Editor, dan nonaktifkan akses tanpa menghapus akun.</p>
        </div>
        <button type="button" onClick={loadProfiles} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d5d0c7] bg-white px-4 py-2 text-xs font-medium hover:bg-[#faf9f6] disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[['Total user', stats.total], ['Aktif', stats.active], ['Admin aktif', stats.admins], ['Editor aktif', stats.editors]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#d5d0c7] bg-white p-4"><div className="text-[10px] uppercase tracking-[0.18em] text-black/40">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div></div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-[#d5d0c7] bg-white p-5">
          <div className="flex items-center gap-2"><UserPlus size={18} /><h2 className="font-semibold">Undang user baru</h2></div>
          <p className="mt-2 text-xs leading-5 text-black/50">Undangan dikirim melalui Supabase Auth. User belum mendapat akses dashboard sebelum profilnya aktif.</p>
          <form onSubmit={inviteUser} className="mt-5 grid gap-4">
            <div><label className="mb-2 block text-xs font-medium">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@example.com" className="w-full rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none focus:border-[#4d6b52]" /></div>
            <div><label className="mb-2 block text-xs font-medium">Role</label><select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full rounded-xl border border-[#d5d0c7] bg-[#faf9f6] px-3 py-3 text-sm outline-none"><option value="editor">Editor — content & operasional</option><option value="admin">Admin — akses penuh</option></select></div>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#181817] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50"><Mail size={14} />{saving ? "Mengirim..." : "Kirim undangan"}</button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#d5d0c7] bg-white">
          <div className="border-b border-[#d5d0c7] px-5 py-4"><h2 className="font-semibold">User yang memiliki akses dashboard</h2><p className="mt-1 text-xs text-black/45">Role dan status akses berlaku server-side.</p></div>
          {error && <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="m-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
          {loading ? <div className="p-6 text-sm text-black/45">Memuat user...</div> : profiles.length === 0 ? <div className="p-6 text-sm text-black/45">Belum ada user terdaftar.</div> : <div className="divide-y divide-[#ece8e1]">
            {profiles.map((profile) => {
              const busy = busyId === profile.id;
              return <div key={profile.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0"><div className="truncate text-sm font-semibold">{profile.email || "Email tidak tersedia"}</div><div className="mt-1 text-[11px] text-black/40">ID: {profile.id}</div><div className="mt-2 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${profile.active ? "bg-green-100 text-green-800" : "bg-black/5 text-black/45"}`}>{profile.active ? "Aktif" : "Nonaktif"}</span><span className="rounded-full border border-[#d5d0c7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">{profile.role}</span></div></div>
                <div className="flex flex-wrap items-center gap-2">
                  <select value={profile.role} disabled={busy} onChange={(e) => updateProfile(profile.id, { role: e.target.value as Role })} className="rounded-lg border border-[#d5d0c7] bg-white px-3 py-2 text-xs"><option value="editor">Editor</option><option value="admin">Admin</option></select>
                  <button type="button" disabled={busy} onClick={() => updateProfile(profile.id, { active: !profile.active })} className="rounded-lg border border-[#d5d0c7] px-3 py-2 text-xs font-medium disabled:opacity-50">{busy ? "Menyimpan..." : profile.active ? "Nonaktifkan" : "Aktifkan"}</button>
                </div>
              </div>;
            })}
          </div>}
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-[#d5d0c7] bg-white p-5 text-xs leading-5 text-black/55"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#4d6b52]" /><div><strong className="text-black">Aturan keamanan:</strong> Admin adalah satu-satunya role yang dapat mengelola user, audit log, estimator, dan penghapusan data. Editor hanya mendapat akses operasional yang memang diizinkan.</div></div>
    </section>
  );
}
