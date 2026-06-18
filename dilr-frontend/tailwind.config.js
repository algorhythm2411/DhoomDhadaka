/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gameDark: "#0f172a", // Deep slate background
        gameCard: "#1e293b", // Lighter slate for cards
        gameNeon: "#10b981", // Emerald green for success/streaks
        gameAccent: "#6366f1", // Indigo for primary actions/buttons
      }
    },
  },
  plugins: [],
}
