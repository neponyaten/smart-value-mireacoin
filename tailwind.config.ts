import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        neon: "#00F0FF",
        glass: "rgba(255,255,255,0.05)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 240, 255, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;