export type PricingProjectType = "Rumah Baru" | "Renovasi" | "Villa" | "Commercial";
export type PricingDesignLevel = "Essential" | "Signature" | "Premium";

export type PricingInput = {
  area: number;
  projectType: PricingProjectType;
  designLevel: PricingDesignLevel;
  floors: number;
  condition: string;
  needs: string[];
  landArea?: number | null;
  minArea: number;
  baseRates: Record<PricingDesignLevel, number>;
  projectMultipliers: Record<PricingProjectType, number>;
  minRangeMultiplier: number;
  maxRangeMultiplier: number;
};

export type PricingResult = {
  area: number;
  base: number;
  projectFactor: number;
  conditionFactor: number;
  floorFactor: number;
  complexityFactor: number;
  scopeFactor: number;
  adjusted: number;
  min: number;
  max: number;
};

const CONDITION_FACTORS: Record<string, number> = {
  "Lahan kosong": 1,
  "Persiapan pembangunan": 1,
  "Bangunan existing": 1.1,
  "Sebagian direnovasi": 1.15,
  "Renovasi total": 1.25,
};

const NEED_FACTORS: Record<string, number> = {
  "Konsep & denah": 0,
  "Desain arsitektur": 0,
  "Desain interior": 0.08,
  "Desain fasad": 0.04,
  "Visualisasi 3D": 0.04,
  "Gambar kerja": 0.08,
  "Perencanaan ruang": 0.03,
  "Renovasi & pengembangan": 0.06,
  "Paket desain lengkap": 0.12,
};

export const PRICING_MODEL_VERSION = "1.0";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safeNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getConditionFactor(condition: string) {
  return CONDITION_FACTORS[condition] ?? 1;
}

export function getFloorFactor(floors: number) {
  const safeFloors = Math.max(1, Math.round(safeNumber(floors, 1)));
  if (safeFloors >= 4) return 1.25;
  if (safeFloors === 3) return 1.15;
  if (safeFloors === 2) return 1.08;
  return 1;
}

export function getScopeFactor(needs: string[]) {
  const uniqueNeeds = [...new Set(needs.filter(Boolean))];
  const hasCompletePackage = uniqueNeeds.includes("Paket desain lengkap");

  if (hasCompletePackage) {
    const addOns = uniqueNeeds
      .filter((need) => need !== "Paket desain lengkap")
      .reduce((sum, need) => sum + (NEED_FACTORS[need] ?? 0), 0);
    return clamp(1.12 + Math.min(addOns, 0.18), 1, 1.3);
  }

  const factor = uniqueNeeds.reduce(
    (sum, need) => sum + (NEED_FACTORS[need] ?? 0),
    1
  );
  return clamp(factor, 1, 1.3);
}

export function getComplexityFactor(input: Pick<PricingInput, "area" | "floors" | "needs" | "landArea">) {
  const area = Math.max(0, safeNumber(input.area, 0));
  const floors = Math.max(1, Math.round(safeNumber(input.floors, 1)));
  const needsCount = new Set(input.needs.filter(Boolean)).size;
  const landArea = input.landArea == null ? null : safeNumber(input.landArea, 0);

  let factor = 1;

  if (area > 300) factor += 0.08;
  else if (area > 200) factor += 0.04;

  if (floors >= 3) factor += 0.06;
  if (needsCount >= 5) factor += 0.05;

  if (landArea && landArea > 0 && area > landArea) factor += 0.03;

  return clamp(factor, 1, 1.25);
}

export function calculateEstimatorPrice(input: PricingInput): PricingResult {
  const area = Math.max(input.minArea, Math.min(10000, Math.round(safeNumber(input.area, input.minArea))));
  const baseRate = safeNumber(input.baseRates[input.designLevel], 0);
  const projectFactor = safeNumber(input.projectMultipliers[input.projectType], 1);
  const conditionFactor = getConditionFactor(input.condition);
  const floorFactor = getFloorFactor(input.floors);
  const complexityFactor = getComplexityFactor({
    area,
    floors: input.floors,
    needs: input.needs,
    landArea: input.landArea,
  });
  const scopeFactor = getScopeFactor(input.needs);

  const base = area * baseRate * projectFactor;
  const adjusted = base * conditionFactor * floorFactor * complexityFactor * scopeFactor;

  return {
    area,
    base,
    projectFactor,
    conditionFactor,
    floorFactor,
    complexityFactor,
    scopeFactor,
    adjusted,
    min: adjusted * input.minRangeMultiplier,
    max: adjusted * input.maxRangeMultiplier,
  };
}
