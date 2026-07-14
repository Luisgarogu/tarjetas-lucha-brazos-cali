import type { CardStatus, ClubRole } from "@/types/card";

export function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}
export function normalizeHeader(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[\s-]+/g, "_");
}
export function normalizeStatus(value: unknown): CardStatus | undefined {
  const status = normalizeText(value).toLowerCase();
  return status === "activo" || status === "active" ? "active" : status === "inactivo" || status === "inactive" ? "inactive" : undefined;
}
export function normalizeRole(value: unknown): ClubRole | undefined {
  const role = normalizeText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const roles: Record<string, ClubRole> = { entrenador: "coach", coach: "coach", deportista: "athlete", athlete: "athlete", integrante: "member", miembro: "member", member: "member", director: "director", asistente: "assistant", assistant: "assistant", other: "other", otro: "other" };
  return roles[role];
}

export function normalizeExcelDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return undefined;
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
  }
  const raw = normalizeText(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const date = new Date(`${raw}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== raw ? undefined : raw;
}
