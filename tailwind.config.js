/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imperial: {
          red: '#8B0000',
          crimson: '#B91C1C',
          dark: '#3B0404',
          gold: '#FFD700',
          amber: '#F59E0B',
          bronze: '#92400E',
        }
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', '"Trebuchet MS"', 'serif'],
        arcade: ['"Fredoka"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 12px rgba(255, 215, 0, 0.4)',
        'gold-intense': '0 0 35px rgba(255, 215, 0, 0.9), 0 0 60px rgba(245, 158, 11, 0.6)',
        'reel-inset': 'inset 0 8px 16px rgba(0,0,0,0.65), inset 0 -8px 16px rgba(0,0,0,0.65)',
      }
    },
  },
  plugins: [],
}

