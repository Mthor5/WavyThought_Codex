/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#04060A',
          900: '#070B12',
          800: '#0D1522',
          500: '#3B82F6',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 255, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
