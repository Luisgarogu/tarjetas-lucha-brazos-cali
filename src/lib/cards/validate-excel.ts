import * as XLSX from "xlsx";
import { z } from "zod";
import type { SportsCard } from "@/types/card";
import { normalizeExcelDate, normalizeHeader, normalizeRole, normalizeStatus, normalizeText } from "./normalize-card";

export interface ExcelValidationError { row: number; field?: string; message: string }
export type ExcelValidationResult = { success: true; cards: SportsCard[] } | { success: false; errors: ExcelValidationError[] };

const cardSchema = z.object({
  id: z.string().min(1, "El id es obligatorio").regex(/^[a-zA-Z0-9_-]+$/, "El id contiene caracteres no permitidos"),
  documentId: z.string().min(1, "La cédula es obligatoria"), fullName: z.string().min(1, "El nombre es obligatorio"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de nacimiento no es válida"),
  weightKg: z.number().positive("El peso debe ser mayor que cero"), heightCm: z.number().positive("La estatura debe ser mayor que cero"),
  clubJoinYear: z.number().int("El año debe ser entero").min(1900).max(new Date().getFullYear() + 1),
  status: z.enum(["active", "inactive"]), role: z.enum(["coach", "athlete", "member", "director", "assistant", "other"]),
  customRoleLabel: z.string().optional(), imageUrl: z.string().min(1), updatedAt: z.string().datetime(),
});

export function validateExcel(buffer: ArrayBuffer): ExcelValidationResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  } catch {
    return { success: false, errors: [{ row: 0, message: "El archivo no es un Excel válido." }] };
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return { success: false, errors: [{ row: 0, message: "El Excel no contiene hojas." }] };

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: true });
  if (!matrix.length) return { success: false, errors: [{ row: 0, message: "El Excel está vacío." }] };

  const headers = matrix[0].map((value) => normalizeHeader(String(value)));
  const required = ["id", "cedula", "nombre_completo", "fecha_nacimiento", "peso_kg", "estatura_cm", "anio_ingreso", "estado", "rol"];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) return { success: false, errors: missing.map((field) => ({ row: 1, field, message: `Falta la columna obligatoria: ${field}` })) };

  const duplicateHeaders = headers.filter((header, index) => header && headers.indexOf(header) !== index);
  if (duplicateHeaders.length) {
    return { success: false, errors: Array.from(new Set(duplicateHeaders)).map((field) => ({ row: 1, field, message: `La columna '${field}' está duplicada.` })) };
  }

  const rows = matrix
    .slice(1)
    .map((values, index) => ({ values, rowNumber: index + 2 }))
    .filter(({ values }) => values.some((cell) => normalizeText(cell)));

  if (!rows.length) return { success: false, errors: [{ row: 0, message: "El Excel no contiene registros." }] };

  const cards: SportsCard[] = [];
  const errors: ExcelValidationError[] = [];
  const ids = new Set<string>();

  rows.forEach(({ values, rowNumber }) => {
    const raw = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
    const id = normalizeText(raw.id);
    const birthDate = normalizeExcelDate(raw.fecha_nacimiento);
    const status = normalizeStatus(raw.estado);
    const role = normalizeRole(raw.rol);
    const candidate = {
      id,
      documentId: normalizeText(raw.cedula),
      fullName: normalizeText(raw.nombre_completo),
      birthDate: birthDate ?? "",
      weightKg: Number(raw.peso_kg),
      heightCm: Number(raw.estatura_cm),
      clubJoinYear: Number(raw.anio_ingreso),
      status,
      role,
      customRoleLabel: normalizeText(raw.rol_personalizado) || undefined,
      imageUrl: normalizeText(raw.foto_url) || `/people/${id}.webp`,
      updatedAt: new Date().toISOString(),
    };

    if (ids.has(id)) errors.push({ row: rowNumber, field: "id", message: `El id '${id}' está duplicado.` });
    ids.add(id);

    const parsed = cardSchema.safeParse(candidate);
    if (!birthDate) errors.push({ row: rowNumber, field: "fecha_nacimiento", message: "Use YYYY-MM-DD o una fecha válida de Excel." });
    if (!status) errors.push({ row: rowNumber, field: "estado", message: "Estado no reconocido. Use activo o inactivo." });
    if (!role) errors.push({ row: rowNumber, field: "rol", message: "Rol no reconocido." });

    if (!parsed.success) {
      parsed.error.issues
        .filter((issue) => !["birthDate", "status", "role"].includes(String(issue.path[0])))
        .forEach((issue) => errors.push({ row: rowNumber, field: String(issue.path[0]), message: issue.message }));
    } else {
      cards.push(parsed.data);
    }
  });

  return errors.length ? { success: false, errors } : { success: true, cards };
}
