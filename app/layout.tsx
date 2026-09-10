import type { Metadata } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const siteName = "ATELIER Architecture & Interior";

const siteDescription =
  "Studio arsitektur dan interior di Kediri yang merancang rumah, renovasi, dan ruang komersial dengan pendekatan tropis kontemporer, fungsional, dan berkarakter.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Jasa Arsitek Kediri | ATELIER Architecture & Interior",
    template: "%s | ATELIER Architecture & Interior",
  },

  description: siteDescription,

  keywords: [
    "jasa arsitek Kediri",
    "arsitek Kediri",
    "desain rumah Kediri",
    "jasa desain rumah Kediri",
    "arsitektur Kediri",
    "renovasi rumah Kediri",
    "interior Kediri",
    "arsitek Jawa Timur",
  ],

  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  alternates: {
    canonical: siteUrl,
  },

  verification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          google:
            process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        }
      : undefined,

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title:
      "Jasa Arsitek Kediri | ATELIER Architecture & Interior",
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Jasa Arsitek Kediri | ATELIER Architecture & Interior",
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
    "@type": "ProfessionalService",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    areaServed: [
      {
        "@type": "City",
        name: "Kediri",
      },
      {
        "@type": "State",
        name: "Jawa Timur",
      },
    ],
    serviceType: [
      "Architecture Design",
      "Residential Architecture",
      "Renovation",
      "Interior Design",
    ],
  };

  return (
    <html lang="id">
      <body>
        {children}

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
