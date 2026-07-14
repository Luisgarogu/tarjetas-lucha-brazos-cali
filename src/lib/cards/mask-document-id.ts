// Para producción real, revise el tratamiento legal y consentimiento de datos personales.
export function maskDocumentId(value: string): string {
  const visible = value.slice(-4);
  return `${"•".repeat(Math.max(4, value.length - visible.length))}${visible}`;
}
