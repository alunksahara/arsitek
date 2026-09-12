import type { Metadata } from "next";

import "./globals.css";
import FloatingNavigation from "@/components/FloatingNavigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "RUMAH ARSITEK";
const siteDescription =
  "RUMAH ARSITEK membantu Anda memulai kebutuhan desain rumah, renovasi, interior, hingga ruang komersial, lalu menemukan solusi profesional yang sesuai.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RUMAH ARSITEK | Partner Mewujudkan Ruang",
    template: "%s | RUMAH ARSITEK",
  },
  description: siteDescription,
  keywords: [
    "RUMAH ARSITEK",
    "jasa arsitek",
    "desain rumah",
    "desain rumah modern",
    "renovasi rumah",
    "desain interior",
    "desain eksterior",
    "desain ruang usaha",
    "konsultasi arsitektur",
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: "RUMAH ARSITEK | Partner Mewujudkan Ruang",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "RUMAH ARSITEK | Partner Mewujudkan Ruang",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <html lang="id">
      <body>
        {children}
        <FloatingNavigation />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </body>
    </html>
  );
}
