/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef7f1",
          100: "#d5ecdd",
          200: "#aad9bb",
          300: "#78c096",
          400: "#489f71",
          500: "#2c8256",
          600: "#1f6844",
          700: "#1a5338",
          800: "#17422e",
          900: "#123527",
        },
        river: {
          50: "#eef5fb",
          100: "#d7e8f6",
          200: "#aed0ed",
          300: "#7cb1df",
          400: "#4c8fcc",
          500: "#2f71b0",
          600: "#245990",
          700: "#204873",
          800: "#1e3d5f",
          900: "#1b344f",
        },
        sand: {
          50: "#fbfaf6",
          100: "#f5f2ea",
          200: "#ece6d6",
        },
      },
      fontFamily: {
        bangla: ["'Noto Sans Bengali'", "sans-serif"],
        sans: ["'Inter'", "'Noto Sans Bengali'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
