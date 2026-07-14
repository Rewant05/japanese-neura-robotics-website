import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#090b0d",
        carbon: "#111417",
        panel: "#171b20",
        chrome: "#e7eef1",
        cyan: "#38e8ff",
        laser: "#ff2f46",
      },
      boxShadow: {
        hud: "0 0 0 1px rgba(56,232,255,.18), 0 20px 80px rgba(0,0,0,.36)",
        redline: "0 0 0 1px rgba(255,47,70,.22), 0 18px 64px rgba(255,47,70,.08)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "IBM Plex Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
