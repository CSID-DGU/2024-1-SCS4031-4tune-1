import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        opaqueWhite: "rgba(255, 255, 255, 0.80)",
      },
      backgroundImage: {
        bgGradient: "linear-gradient(180deg, #000 0%, #242142 100%)",
        blueGradient: "linear-gradient(180deg, #0E1D3C 0%, #000 100%)",
        redGradient: "linear-gradient(180deg, #0E1D3C 0%, #410C0C 100%)",
      },
      boxShadow: {
        dashboordShadow: "0px -5px 10px 0px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
