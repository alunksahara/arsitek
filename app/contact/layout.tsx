import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Konsultasi Proyek Arsitektur, Renovasi & Interior",
  description:
    "Ceritakan rencana rumah, renovasi, interior, atau ruang usaha Anda kepada RUMAH ARSITEK untuk memulai konsultasi dan mendapatkan arahan yang sesuai.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Konsultasi Proyek | RUMAH ARSITEK",
    description:
      "Mulai konsultasi untuk kebutuhan desain rumah, renovasi, interior, atau ruang usaha bersama RUMAH ARSITEK.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
