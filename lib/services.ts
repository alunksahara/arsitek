export type ServiceDefinition = {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  aliases: string[];
};

/**
 * Canonical service taxonomy used for internal linking.
 * Location CMS keeps its existing string[] schema, so this registry adds
 * consistency without requiring a database migration.
 */
export const SERVICES: ServiceDefinition[] = [
  {
    slug: "rumah-baru",
    label: "Rumah Baru",
    shortLabel: "Rumah baru",
    description: "Mulai dari kebutuhan keluarga, lahan, ruang, hingga arah desain dan perencanaan.",
    aliases: ["rumah baru", "desain rumah tinggal", "rumah tinggal", "desain rumah"],
  },
  {
    slug: "renovasi",
    label: "Renovasi",
    shortLabel: "Renovasi",
    description: "Cari solusi untuk ruang yang terlalu sempit, kurang terang, atau tidak lagi sesuai.",
    aliases: ["renovasi", "renovasi & pengembangan desain", "pengembangan desain"],
  },
  {
    slug: "interior",
    label: "Interior",
    shortLabel: "Interior",
    description: "Bangun ruang yang nyaman, fungsional, rapi, dan memiliki karakter.",
    aliases: ["interior", "interior & eksterior", "interior dan eksterior"],
  },
  {
    slug: "ruang-usaha",
    label: "Ruang Usaha",
    shortLabel: "Ruang usaha",
    description: "Café, toko, kantor, kos, villa, guest house, dan kebutuhan komersial lainnya.",
    aliases: ["ruang usaha", "komersial", "cafe", "café", "toko", "kantor", "kos", "villa", "guest house"],
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug) || null;
}

export function findService(value: string) {
  const normalized = normalize(value);
  return (
    SERVICES.find(
      (service) =>
        normalize(service.label) === normalized ||
        service.aliases.some((alias) => normalize(alias) === normalized)
    ) || null
  );
}

export function getServiceHref(value: string) {
  const service = findService(value);
  return service ? `/services#${service.slug}` : null;
}
