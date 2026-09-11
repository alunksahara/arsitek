import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RUMAH ARSITEK",
    short_name: "RUMAH ARSITEK",
    description:
      "Partner untuk memulai kebutuhan desain rumah, renovasi, interior, dan ruang usaha.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: "#2f6b4a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
