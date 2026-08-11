import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        "builder-bg": "#0f0f11",
        "builder-surface": "#1a1a1f",
        "builder-border": "#2a2a35",
        "builder-hover": "#252530",
        "builder-accent": "#6366f1",
        "builder-accent-hover": "#4f46e5",
        "builder-text": "#e4e4e7",
        "builder-muted": "#71717a",
        "builder-danger": "#ef4444",
      },
    },
  },
  plugins: [],
};
export default config;
