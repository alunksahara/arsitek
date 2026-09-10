import type { Metadata } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const siteName = "RUMAH ARSITEK";
const siteDescriptor = "Architecture · Interior · Exterior";

const siteDescription =
  "RUMAH ARSITEK adalah studio arsitektur di Kediri yang merancang rumah secara menyeluruh, dari arsitektur dan eksterior hingga interior, dengan desain yang fungsional, berkarakter, dan selaras.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Jasa Arsitek Kediri | RUMAH ARSITEK",
    template: "%s | RUMAH ARSITEK",
  },

  description: siteDescription,

  keywords: [
    "jasa arsitek Kediri",
    "arsitek Kediri",
    "desain rumah Kediri",
    "jasa desain rumah Kediri",
    "arsitek rumah Kediri",
    "desain rumah modern Kediri",
    "renovasi rumah Kediri",
    "interior Kediri",
    "desain eksterior Kediri",
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
      "Jasa Arsitek Kediri | RUMAH ARSITEK",
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Jasa Arsitek Kediri | RUMAH ARSITEK",
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
    alternateName: siteDescriptor,
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
      "Exterior Design",
      "Interior Design",
      "Home Renovation",
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
