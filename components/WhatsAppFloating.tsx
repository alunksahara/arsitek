"use client";

import { MessageCircle } from "lucide-react";

const DEFAULT_WHATSAPP_NUMBER = "6285736149999";

export default function WhatsAppFloating() {
  const number = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_WHATSAPP_NUMBER
  ).replace(/\D/g, "");

  const message = encodeURIComponent(
    "Halo RUMAH ARSITEK, saya ingin berkonsultasi mengenai rencana proyek saya."
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 left-4 z-[70] inline-flex min-h-12 items-center gap-2 rounded-full bg-[#24563b] px-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#173d29] sm:bottom-6 sm:left-6 sm:px-5"
      aria-label="Chat WhatsApp dengan RUMAH ARSITEK"
    >
      <MessageCircle size={18} aria-hidden="true" />
      <span>Chat WhatsApp</span>
    </a>
  );
}
