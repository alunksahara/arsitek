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

  // =========================================================
  // CHECK SESSION
  // =========================================================
  useEffect(() => {
    async function checkSession() {
      try {
        const supabase =
          createBrowserSupabase();

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        console.log(
          "ADMIN LOGIN SESSION CHECK:",
          session
        );

        /*
         * PENTING:
         * Jangan redirect berdasarkan keberadaan session.
         *
         * User biasa juga memiliki session.
         *
         * Middleware sudah menangani:
         * - admin -> /admin
         * - non-admin -> tetap /admin/login
         */
      } catch (err) {
        console.error(
          "SESSION CHECK ERROR:",
          err
        );
      } finally {
        setChecking(false);
      }
    }

    checkSession();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================
  async function submit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const supabase =
        createBrowserSupabase();

      console.log(
        "================================="
      );
      console.log("ADMIN LOGIN START");
      console.log("EMAIL:", email);
      console.log(
        "================================="
      );

      // -----------------------------------------------------
      // 1. LOGIN SUPABASE
      // -----------------------------------------------------
      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          }
        );

      if (loginError) {
        console.error(
          "ADMIN LOGIN ERROR:",
          loginError
        );

        setError(
          "Email atau password tidak valid."
        );

        setBusy(false);
        return;
      }

      console.log(
        "LOGIN AUTH SUCCESS:",
        data.user?.email
      );

      // -----------------------------------------------------
      // 2. PASTIKAN SESSION TERBENTUK
      // -----------------------------------------------------
      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      console.log(
        "SESSION AFTER LOGIN:",
        session
      );

      if (!session) {
        console.error(
          "LOGIN BERHASIL TAPI SESSION TIDAK ADA"
        );

        setError(
          "Login berhasil, tetapi session belum terbentuk. Silakan coba lagi."
        );

        setBusy(false);
        return;
      }

      console.log(
        "SESSION BERHASIL:",
        session.user.email
      );

      // -----------------------------------------------------
      // 3. CEK AKSES ADMIN
      // -----------------------------------------------------
      const adminCheckResponse =
        await fetch(
          "/api/admin/profiles",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      console.log(
        "ADMIN CHECK STATUS:",
        adminCheckResponse.status
      );

      // -----------------------------------------------------
      // 4. BUKAN ADMIN
      // -----------------------------------------------------
      if (!adminCheckResponse.ok) {
        console.warn(
          "USER BUKAN ADMIN:",
          session.user.email
        );

        // Hapus session user biasa
        await supabase.auth.signOut();

        setError(
          "Akun berhasil login, tetapi tidak memiliki akses admin."
        );

        setBusy(false);
        return;
      }

      // -----------------------------------------------------
      // 5. ADMIN TERBUKTI
      // -----------------------------------------------------
      console.log(
        "ADMIN ACCESS VERIFIED:",
        session.user.email
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 300)
      );

      console.log(
        "REDIRECTING TO /admin"
      );

      window.location.replace(
        "/admin"
      );
    } catch (err) {
      console.error(
        "ADMIN LOGIN UNEXPECTED ERROR:",
        err
      );

      setError(
        "Terjadi kesalahan saat login. Silakan coba lagi."
      );

      setBusy(false);
    }
  }

  // =========================================================
  // CHECKING SESSION SCREEN
  // =========================================================
  if (checking) {
    return (
      <main className="min-h-screen bg-[#171715] text-[#f4f1eb] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl tracking-[0.15em]">
            ATELIER
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/40">
            Checking session...
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // LOGIN PAGE
  // =========================================================
  return (
    <main className="min-h-screen bg-[#171715] text-[#f4f1eb] flex items-center">
      <div className="mx-auto w-full max-w-md px-7">
        <p className="font-display text-2xl tracking-[0.15em]">
          ATELIER
        </p>

        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">
          Private admin
        </p>

        <h1 className="mt-12 font-display text-5xl">
          Welcome back.
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
          Sign in to access your private
          architecture studio dashboard.
        </p>

        <form
          onSubmit={submit}
          className="mt-10 grid gap-6"
        >
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40"
            >
              Email
            </label>

            <input
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full border-b border-white/20 bg-transparent py-4 outline-none transition focus:border-white/70"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40"
            >
              Password
            </label>

            <input
              id="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border-b border-white/20 bg-transparent py-4 outline-none transition focus:border-white/70"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="border border-red-400/20 bg-red-400/5 px-4 py-3">
              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={busy}
            className="mt-3 bg-[#f4f1eb] px-8 py-4 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-xs leading-5 text-white/25">
          Authorized access only.
        </p>
      </div>
    </main>
  );
}