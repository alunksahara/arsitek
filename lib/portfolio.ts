import { findService, type ServiceDefinition } from "@/lib/services";
import type { PublicLocation } from "@/lib/public-content";

export type PortfolioRelation = {
  service: ServiceDefinition | null;
  location: PublicLocation | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Resolves legacy portfolio text into the existing canonical Service + Location
 * entities without changing the portfolio database schema.
 */
export function resolvePortfolioRelations(
  project: { category: string | null; location: string | null },
  locations: PublicLocation[]
): PortfolioRelation {
  const service = project.category ? findService(project.category) : null;
  const rawLocation = normalize(project.location || "");

  if (!rawLocation) return { service, location: null };

  const location =
    locations.find((item) => {
      const city = normalize(item.city);
      const slug = normalize(item.slug);
      return rawLocation === city || rawLocation === slug || rawLocation.startsWith(`${city},`);
    }) || null;

  return { service, location };
}

export function getPortfolioLocationLabel(
  project: { location: string | null },
  location: PublicLocation | null
) {
  return location ? `${location.city}, ${location.province}` : project.location;
}
