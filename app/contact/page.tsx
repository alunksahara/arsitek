"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import Turnstile from "@/components/Turnstile";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const projectType = String(data.get("projectType") || "").trim();
    const budget = String(data.get("budget") || "").trim();
    const message = String(data.get("message") || "").trim();
    const turnstileToken = String(data.get("cf-turnstile-response") || "");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          projectType,
          budget,
          message,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Terjadi kesalahan. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      form.reset();

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();

      if (whatsappNumber) {
        const whatsappMessage = [
          "Halo ATELIER, saya ingin berkonsultasi mengenai proyek arsitektur.",
          "",
          `Nama: ${name}`,
          `WhatsApp: ${phone}`,
          `Email: ${email || "-"}`,
          `Jenis proyek: ${projectType || "-"}`,
          `Budget: ${budget || "-"}`,
          "",
          `Detail proyek: ${message || "-"}`,
        ].join("\n");

        const whatsappUrl =
          `https://wa.me/${whatsappNumber}` +
          `?text=${encodeURIComponent(whatsappMessage)}`;

        window.setTimeout(() => {
          window.location.href = whatsappUrl;
        }, 700);
      }

      setLoading(false);
    } catch (err) {
      console.error("[CONTACT FORM ERROR]", err);
      setError("Tidak dapat mengirim formulir. Periksa koneksi Anda lalu coba lagi.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1eb] py-8 md:py-16">
      <div className="container-main">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#343731]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Kembali
        </a>

        <div className="mx-auto mt-12 max-w-5xl md:mt-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#24563b]">
              Konsultasi proyek
            </p>

            <h1 className="mt-5 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[-0.05em] text-[#171715]">
              Ceritakan rencana
              <br />
              <i>ruang Anda.</i>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#77736c] md:text-lg">
              Ceritakan kebutuhan, jenis proyek, dan gambaran anggaran Anda.
              Tim ATELIER akan menggunakan informasi ini sebagai awal diskusi.
            </p>
          </div>

          {success ? (
            <div className="mt-12 border border-[#cfc9be] bg-white/50 p-7 md:mt-16 md:p-10">
              <Check size={30} aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl text-[#171715] md:text-4xl">
                Terima kasih.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#77736c]">
                Konsultasi Anda sudah tercatat. Jika nomor WhatsApp ATELIER telah
                dikonfigurasi, Anda akan diarahkan ke WhatsApp dalam beberapa saat.
              </p>
              <a
                href="/"
                className="mt-7 inline-flex min-h-12 items-center border border-[#171715] px-6 text-xs font-bold uppercase tracking-[0.18em]"
              >
                Kembali ke beranda
              </a>
            </div>
          ) : (
            <form onSubmit={submitForm} className="mt-10 grid gap-8 md:mt-14">
              <div className="grid gap-8 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                  Nama lengkap
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Nama Anda"
                    className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                  WhatsApp / Telepon
                  <input
                    name="phone"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="08xxxxxxxxxx"
                    className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]"
                  />
                </label>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                  Email
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                  Jenis proyek
                  <select
                    name="projectType"
                    required
                    defaultValue=""
                    className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none focus:border-[#24563b]"
                  >
                    <option value="" disabled>
                      Pilih jenis proyek
                    </option>
                    <option>Rumah baru</option>
                    <option>Renovasi</option>
                    <option>Interior</option>
                    <option>Komersial</option>
                    <option>Lainnya</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                Perkiraan anggaran
                <select
                  name="budget"
                  defaultValue=""
                  className="min-h-14 border-b border-[#cfc9be] bg-transparent px-0 py-3 outline-none focus:border-[#24563b]"
                >
                  <option value="" disabled>
                    Pilih kisaran anggaran
                  </option>
                  <option>Di bawah Rp 500 juta</option>
                  <option>Rp 500 juta – Rp 1 miliar</option>
                  <option>Rp 1 – 2 miliar</option>
                  <option>Rp 2 – 5 miliar</option>
                  <option>Di atas Rp 5 miliar</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#343731]">
                Ceritakan proyek Anda
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Contoh: luas tanah, lokasi, kebutuhan ruang, gaya yang disukai, target waktu, atau hal lain yang penting bagi Anda."
                  className="resize-y border border-[#cfc9be] bg-white/40 p-4 font-normal outline-none transition-colors placeholder:text-[#9a968d] focus:border-[#24563b]"
                />
              </label>

              <div className="pt-1">
                <Turnstile />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#171715] px-8 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#24563b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim konsultasi"}
                </button>

                <p className="max-w-md text-xs leading-5 text-[#77736c]">
                  Data Anda digunakan untuk menindaklanjuti permintaan konsultasi.
                  Setelah berhasil dikirim, Anda dapat melanjutkan percakapan melalui WhatsApp.
                </p>
              </div>
            </form>
          )}

          <div className="mt-14 flex items-center gap-3 border-t border-[#cfc9be] pt-5 text-xs text-[#77736c] md:mt-20">
            <MessageCircle size={16} aria-hidden="true" />
            Konsultasi awal untuk proyek arsitektur, renovasi, dan interior.
          </div>
        </div>
      </div>
    </main>
  );
}
