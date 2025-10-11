/** @type {import('tailwindcss').Config} */
import { theme } from './src/styles/theme.js'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2ff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1"
        },
        jalsarathi: {
          blue: "#0073e6",
          lightblue: "#0ea5e9",
          green: "#22c55e"
        }
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
}
