import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface:  "#f0f4f8",
        panel:    "#ffffff",
        panel2:   "#e8eef5",
        border:   "#cdd8e8",
        muted:    "#7a9abf",
        "text-main": "#1a2a3a",
        "text-sub":  "#4a6580",
        accent:   "#38bdf8",
        brand:    "#0284c7",
        brand2:   "#0369a1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 4px rgba(30,60,100,0.07), 0 4px 16px rgba(30,60,100,0.05)",
        "card-hover": "0 4px 12px rgba(30,60,100,0.12), 0 8px 24px rgba(30,60,100,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
