"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingNavigation() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex items-center gap-2 sm:bottom-6 sm:right-6">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#cfd8d1] bg-white text-[#24563b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e9f1eb]"
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
        >
          ↑
        </button>
      )}
      <Link
        href="/services"
        className="hidden h-11 items-center gap-2 rounded-full border border-[#24563b] bg-white px-4 text-xs font-black text-[#24563b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e9f1eb] sm:inline-flex"
        aria-label="Lihat layanan RUMAH ARSITEK"
      >
        <span aria-hidden="true">✦</span>
        <span>Layanan</span>
      </Link>
      <Link
        href="/lokasi"
        className="hidden h-11 items-center gap-2 rounded-full border border-[#24563b] bg-white px-4 text-xs font-black text-[#24563b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e9f1eb] sm:inline-flex"
        aria-label="Lihat lokasi RUMAH ARSITEK"
      >
        <span aria-hidden="true">⌖</span>
        <span>Lokasi</span>
      </Link>
      <Link
        href="/"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#24563b] bg-[#24563b] px-4 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#173d29]"
        aria-label="Kembali ke beranda RUMAH ARSITEK"
      >
        <span aria-hidden="true">⌂</span>
        <span>Beranda</span>
      </Link>
    </div>
  );
}
