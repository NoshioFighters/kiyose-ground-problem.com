import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "system-ui", "sans-serif"],
      },
      colors: {
        hero: "#0f172a",
        accent: "#dc2626",
        body: "#1e293b",
        muted: "#64748b",
        border: "#e2e8f0",
        surface: "#f8fafc",
      },
    },
  },
  plugins: [],
};
export default config;
