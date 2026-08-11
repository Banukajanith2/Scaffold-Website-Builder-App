import type { Config } from "tailwindcss";

/**
 * Ember palette.
 *
 * Neutrals carry a warm bias toward the accent rather than being pure grey, so
 * the chrome reads as chosen instead of inherited. Every text pairing below
 * clears WCAG AA against the surface it sits on.
 *
 * Brand and destructive are both warm, so they are separated by treatment, not
 * hue alone: brand is a bright fill with a near-black label, destructive is a
 * tinted outline with a light rose label. Different fill, opposite label
 * polarity, 35 degrees apart.
 */
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
        // Surfaces, darkest to lightest
        "builder-bg": "#0c0a09",
        "builder-surface": "#171312",
        "builder-elevated": "#211b19", // cards, popovers, inputs on surface
        "builder-hover": "#2a2220",
        "builder-border": "#332a27",
        "builder-border-strong": "#4a3d39", // selected and focused edges

        // Brand
        "builder-accent": "#f97316",
        "builder-accent-hover": "#fb923c", // brighter on hover, not darker
        "builder-accent-ink": "#1c0d03", // label on an accent fill, 6.76:1
        "builder-ring": "#fb923c",

        // Gradient stops, decorative surfaces only
        "builder-grad-from": "#be123c",
        "builder-grad-via": "#ea580c",
        "builder-grad-to": "#f59e0b",

        // Text
        "builder-text": "#f5eeea", // 16.08:1 on surface
        "builder-muted": "#b3a29c", // 7.52:1 on surface, was 3.59:1
        "builder-subtle": "#8a7873", // large text and icons only

        // Semantic, deliberately unlike the brand
        "builder-danger": "#fb7185",
        "builder-danger-fill": "#9f1239",
        "builder-success": "#34d399",
        "builder-warning": "#fbbf24",
      },
      boxShadow: {
        // Cards sit above the page rather than being drawn onto it. This is
        // what replaces a brighter border for hierarchy.
        card: "0 1px 2px rgba(0,0,0,.4), 0 10px 24px -14px rgba(0,0,0,.7)",
        "card-hover": "0 2px 4px rgba(0,0,0,.4), 0 18px 36px -16px rgba(0,0,0,.75)",
        pop: "0 24px 60px -20px rgba(0,0,0,.8)",
      },
      transitionTimingFunction: {
        // One curve for everything entering or moving.
        ease: "cubic-bezier(.2, 0, 0, 1)",
      },
      transitionDuration: {
        micro: "150ms",
        element: "240ms",
        view: "400ms",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 240ms cubic-bezier(.2,0,0,1) both",
        "scale-in": "scale-in 240ms cubic-bezier(.2,0,0,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
