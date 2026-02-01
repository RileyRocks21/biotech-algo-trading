/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070A",
        surface: "#0F1218",
        accent: "#00F0FF",
        bullish: "#00C087",
        bearish: "#FF3B69",
      },
    },
  },
  plugins: [],
}