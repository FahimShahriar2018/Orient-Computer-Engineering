/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orient: {
          dark: '#0B1120',
          navy: '#0F172A',
          slate: '#1E293B',
          card: '#182234',
          border: '#334155',
          accent: '#06B6D4',
          'accent-hover': '#0891B2',
          orange: '#F97316',
          'orange-hover': '#EA580C',
          amber: '#F59E0B',
          gold: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-orange': '0 0 20px -5px rgba(249, 115, 22, 0.3)',
      }
    },
  },
  plugins: [],
}
