import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        panel: "var(--panel)",
        edge: "var(--edge)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        rising: "var(--rising)",
        fading: "var(--fading)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      keyframes: {
        riseIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" }
        },
        drawBar: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" }
        },
        sweep: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(300%)" }
        }
      },
      animation: {
        riseIn: "riseIn 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        pulseSoft: "pulseSoft 1400ms ease-in-out infinite",
        drawBar: "drawBar 700ms cubic-bezier(0.16, 1, 0.3, 1) both",
        sweep: "sweep 1600ms ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
