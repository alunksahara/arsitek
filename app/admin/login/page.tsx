"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createBrowserSupabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createBrowserSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        console.log("ADMIN LOGIN SESSION CHECK:", session);
      } catch (err) {
        console.error("SESSION CHECK ERROR:", err);
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const supabase = createBrowserSupabase();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        console.error("ADMIN LOGIN ERROR:", loginError);
        setError("Email atau password tidak valid.");
        setBusy(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Login berhasil, tetapi session belum terbentuk. Silakan coba lagi.");
        setBusy(false);
        return;
      }

      console.log("LOGIN AUTH SUCCESS:", data.user?.email);

      const adminCheckResponse = await fetch("/api/admin/profiles", {
        method: "GET",
        cache: "no-store",
      });

      if (!adminCheckResponse.ok) {
        await supabase.auth.signOut();
        setError("Akun berhasil login, tetapi tidak memiliki akses admin.");
        setBusy(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      window.location.replace("/admin");
    } catch (err) {
      console.error("ADMIN LOGIN UNEXPECTED ERROR:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#171715] text-[#f4f1eb] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl tracking-[0.15em]">RUMAH ARSITEK</p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/40">
            Checking session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171715] text-[#f4f1eb] flex items-center">
      <div className="mx-auto w-full max-w-md px-7">
        <p className="font-display text-2xl tracking-[0.15em]">RUMAH ARSITEK</p>
        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">Private admin</p>

        <h1 className="mt-12 font-display text-5xl">Welcome back.</h1>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
          Sign in to access your private architecture studio dashboard.
        </p>

        <form onSubmit={submit} className="mt-10 grid gap-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full border-b border-white/20 bg-transparent py-4 outline-none transition focus:border-white/70"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border-b border-white/20 bg-transparent py-4 outline-none transition focus:border-white/70"
            />
          </div>

          {error && (
            <div className="border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm leading-6 text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-3 bg-[#f4f1eb] px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-xs leading-5 text-white/25">Authorized access only.</p>
      </div>
    </main>
  );
}
