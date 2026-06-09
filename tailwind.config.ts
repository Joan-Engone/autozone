import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D80005",
        "on-primary": "#FFFFFF",
        "surface-variant": "#F8F9FA",
        "on-surface": "#000000",
        secondary: "#5f5e5e",
        outline: "#E5E7EB",
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        xl: "0px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      maxWidth: {
        "container-max": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;