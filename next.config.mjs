// npm registra únicamente el binario SWC de la plataforma actual. Evita que
// Next intente reescribir el lockfile con binarios de otros sistemas.
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = "true";

/** @type {import('next').NextConfig} */
const nextConfig = { images: { remotePatterns: [{ protocol: "https", hostname: "**" }] } };
export default nextConfig;
