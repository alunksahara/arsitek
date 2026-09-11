import type { Metadata } from "next";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "RUMAH ARSITEK";
const siteDescriptor = "Architecture · Interior · Exterior";
const siteDescription =
  "RUMAH ARSITEK membantu Anda memulai kebutuhan desain rumah, renovasi, interior, hingga ruang usaha, lalu menemukan jalan menuju partner profesional yang sesuai.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "RUMAH ARSITEK | Partner Mewujudkan Ruang", template: "%s | RUMAH ARSITEK" },
  description: siteDescription,
  keywords: ["RUMAH ARSITEK", "jasa arsitek Kediri", "arsitek Kediri", "desain rumah Kediri", "jasa desain rumah Kediri", "renovasi rumah Kediri", "desain interior Kediri", "desain eksterior Kediri", "arsitek Jawa Timur", "desain rumah modern"],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], shortcut: ["/icon.svg"], apple: [{ url: "/icon.svg" }] },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: siteUrl },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: { type: "website", locale: "id_ID", url: siteUrl, siteName, title: "RUMAH ARSITEK | Partner Mewujudkan Ruang", description: siteDescription },
  twitter: { card: "summary_large_image", title: "RUMAH ARSITEK | Partner Mewujudkan Ruang", description: siteDescription },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    alternateName: siteDescriptor,
    url: siteUrl,
    description: siteDescription,
    areaServed: [
      { "@type": "City", name: "Kediri" },
      { "@type": "State", name: "Jawa Timur" },
      { "@type": "Country", name: "Indonesia" },
    ],
    serviceType: ["Architecture Design", "Residential Architecture", "Exterior Design", "Interior Design", "Home Renovation", "Commercial Space Design"],
  };

  return (
    <html lang="id">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
