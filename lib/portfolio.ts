import { findService, type ServiceDefinition } from "@/lib/services";
import type { PublicLocation } from "@/lib/public-content";

export type PortfolioRelation = {
  service: ServiceDefinition | null;
  location: PublicLocation | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getLocationTokens(value: string) {
  const normalized = normalize(value);
  const tokens = new Set<string>([normalized]);

  for (const separator of ["·", "|", ","]) {
    const first = normalized.split(separator)[0]?.trim();
    if (first) tokens.add(first);
  }

  return tokens;
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
  const projectTokens = getLocationTokens(rawLocation);

  if (!rawLocation) return { service, location: null };

  const location =
    locations.find((item) => {
      const city = normalize(item.city);
      const slug = normalize(item.slug);

      return (
        projectTokens.has(city) ||
        projectTokens.has(slug) ||
        rawLocation.startsWith(`${city},`) ||
        rawLocation.startsWith(`${city} `)
      );
    }) || null;

  return { service, location };
}

export function getPortfolioLocationLabel(
  project: { location: string | null },
  location: PublicLocation | null
) {
  return location ? `${location.city}, ${location.province}` : project.location;
}
