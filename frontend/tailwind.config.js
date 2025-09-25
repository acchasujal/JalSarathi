/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          500: '#0073e6',
          600: '#0059b3',
          700: '#004080',
        },
        jalsarathi: {
          blue: '#0073e6',
          lightblue: '#0ea5e9',
          green: '#22c55e'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}