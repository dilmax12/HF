/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medieval-dark': '#1a1a1a',
        'medieval-gold': '#d4a017',
        'parchment': '#f4e8c1',
      },
    },
  },
  plugins: [],
}
