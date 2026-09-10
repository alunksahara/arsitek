import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ATELIER — Architecture & Interior", template: "%s — ATELIER" },
  description: "Architecture, interior and spatial design crafted around the way you live.",
  keywords: ["arsitek Kediri", "jasa arsitek Kediri", "interior Kediri", "arsitektur Jawa Timur"],
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: { title: "ATELIER — Architecture & Interior", description: "Architecture, interior and spatial design crafted around the way you live.", type: "website", url: siteUrl },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ATELIER Architecture & Interior",
    url: siteUrl,
    description: "Architecture, interior and spatial design studio.",
    areaServed: ["Kediri", "Malang", "Surabaya", "Jawa Timur"],
  };
  return <html lang="id"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body></html>;
}
