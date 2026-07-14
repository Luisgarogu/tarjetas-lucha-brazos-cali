import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title: "Armwrestling Cali", description: "Credenciales deportivas de Lucha Brazos Cali" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
