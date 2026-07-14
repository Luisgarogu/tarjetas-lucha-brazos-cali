import type { WeightCategory } from "@/types/card";
export function calculateWeightCategory(weightKg: number): WeightCategory {
  if (weightKg <= 65) return { code: "U65", label: "Menos de 65 kg", shortLabel: "-65 KG" };
  if (weightKg <= 70) return { code: "U70", label: "Menos de 70 kg", shortLabel: "-70 KG" };
  if (weightKg <= 75) return { code: "U75", label: "Menos de 75 kg", shortLabel: "-75 KG" };
  if (weightKg <= 80) return { code: "U80", label: "Menos de 80 kg", shortLabel: "-80 KG" };
  if (weightKg <= 90) return { code: "U90", label: "Menos de 90 kg", shortLabel: "-90 KG" };
  if (weightKg <= 100) return { code: "U100", label: "Menos de 100 kg", shortLabel: "-100 KG" };
  return { code: "O100", label: "Más de 100 kg", shortLabel: "+100 KG" };
}
