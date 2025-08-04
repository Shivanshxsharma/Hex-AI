/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true, // This should help with Clerk conflicts
  theme: {
    extend: {
      colors: {
        'clerk-primary': '#7c3aed',
        'clerk-bg': '#171717',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}