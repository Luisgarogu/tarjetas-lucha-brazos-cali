import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "armcali_admin"; const MAX_AGE = 60 * 60 * 8;
function secret(): string { const value = process.env.ADMIN_SESSION_SECRET; if (!value) throw new Error("Falta ADMIN_SESSION_SECRET en las variables de entorno."); return value; }
function sign(payload: string): string { return createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function createAdminSession(): void {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  cookies().set(COOKIE_NAME, `${payload}.${sign(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}
export function clearAdminSession(): void { cookies().set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 }); }
export function hasValidAdminSession(): boolean {
  try { const value = cookies().get(COOKIE_NAME)?.value; if (!value) return false; const [payload, signature] = value.split("."); if (!payload || !signature) return false; const expected = sign(payload); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false; const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number }; return typeof data.exp === "number" && data.exp > Date.now(); } catch { return false; }
}
export function safeCredentialMatch(value: string, expected: string): boolean { const a = createHmac("sha256", secret()).update(value).digest(); const b = createHmac("sha256", secret()).update(expected).digest(); return timingSafeEqual(a, b); }
