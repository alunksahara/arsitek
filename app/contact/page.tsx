"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
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
const projectType = String(
  data.get("projectType") || ""
).trim();
const budget = String(
  data.get("budget") || ""
).trim();
const message = String(
  data.get("message") || ""
).trim();

const turnstileToken = String(
  data.get("cf-turnstile-response") || ""
);

try {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    setError(
      result?.error ||
        "Terjadi kesalahan. Silakan coba lagi."
    );
    setLoading(false);
    return;
  }

  /*
   * Lead sudah berhasil tersimpan di database.
   * Setelah itu baru arahkan calon klien ke WhatsApp.
   */

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "6281234567890";

  const whatsappMessage = [
    "Halo ATELIER, saya ingin berkonsultasi mengenai proyek arsitektur.",
    "",
    `Nama: ${name}`,
    `WhatsApp: ${phone}`,
    `Email: ${email || "-"}`,
    `Jenis proyek: ${projectType}`,
    `Budget: ${budget || "-"}`,
    "",
    `Detail proyek: ${message || "-"}`,
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(whatsappMessage)}`;

  setSuccess(true);
  form.reset();
  setLoading(false);

  window.location.href = whatsappUrl;
} catch (err) {
  console.error("[CONTACT FORM ERROR]", err);

  setError(
    "Tidak dapat mengirim formulir. Periksa koneksi Anda lalu coba lagi."
  );

  setLoading(false);
}

}

return ( <main className="min-h-screen bg-[#f4f1eb] py-10 md:py-16"> <div className="container-main"> <a
       href="/"
       className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
     > <ArrowLeft size={15} />
Back </a>

    <div className="mx-auto mt-20 max-w-4xl">
      <p className="text-xs uppercase tracking-[0.3em] text-[#77736c]">
        Start a project
      </p>

      <h1 className="mt-6 font-display text-6xl leading-none md:text-8xl">
        Tell us about
        <br />
        <i>your vision.</i>
      </h1>

      {success ? (
        <div className="mt-16 border border-[#cfc9be] p-8">
          <Check size={28} />

          <h2 className="mt-5 font-display text-3xl">
            Thank you.
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#77736c]">
            Your inquiry has been received.
            <br />
            Opening WhatsApp...
          </p>
        </div>
      ) : (
        <form
          onSubmit={submitForm}
          className="mt-16 grid gap-7"
        >
          <input
            name="name"
            required
            placeholder="Your name"
            className="border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          />

          <input
            name="phone"
            required
            placeholder="Phone / WhatsApp"
            className="border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          />

          <select
            name="projectType"
            required
            defaultValue=""
            className="border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          >
            <option value="" disabled>
              Project type
            </option>

            <option>New House</option>
            <option>Renovation</option>
            <option>Interior</option>
            <option>Commercial</option>
            <option>Other</option>
          </select>

          <select
            name="budget"
            defaultValue=""
            className="border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          >
            <option value="" disabled>
              Estimated budget
            </option>

            <option>Below Rp 500 juta</option>
            <option>Rp 500 juta – Rp 1 Miliar</option>
            <option>Rp 1 – 2 Miliar</option>
            <option>Rp 2 – 5 Miliar</option>
            <option>Above Rp 5 Miliar</option>
          </select>

          <div className="pt-2">
            <Turnstile />
          </div>

          <textarea
            name="message"
            rows={5}
            placeholder="Tell us about your project..."
            className="resize-none border-b border-[#cfc9be] bg-transparent py-4 outline-none"
          />

          {error && (
            <p className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-fit bg-[#171715] px-9 py-5 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send inquiry"}
          </button>
        </form>
      )}
    </div>
  </div>
</main>

);
}
