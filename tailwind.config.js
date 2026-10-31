/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'sans-serif'] },
      colors: {
        forest: { 50: '#effaf2', 100: '#d9f3df', 500: '#22a653', 600: '#168343', 700: '#166534', 800: '#14532d', 900: '#123f25' }
      },
      boxShadow: { soft: '0 12px 35px rgba(20, 83, 45, .08)' }
    },
  },
  plugins: [],
}
