/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
      },
      colors: {
        primary: '#2563eb',
        success: '#10b981',
        error: '#ef4444',
        dark: '#020617',
        'glass-white': 'rgba(255, 255, 255, 0.05)',
        'glass-card': 'rgba(255, 255, 255, 0.7)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
