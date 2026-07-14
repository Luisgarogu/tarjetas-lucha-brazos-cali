import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { fontFamily: { sans: ["Arial", "sans-serif"] }, boxShadow: { glow: "0 0 50px rgba(185, 28, 28, .22)" } } }, plugins: [] } satisfies Config;
