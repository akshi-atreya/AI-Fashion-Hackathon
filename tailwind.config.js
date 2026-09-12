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
        noir: {
          950: '#030303',
          900: '#080808',
          850: '#0D0D0D',
          800: '#141414',
          700: '#1F1F1F',
          600: '#2E2E2E',
          500: '#424242',
        },
        luxe: {
          gold: '#D4AF37',
          champagne: '#E5D3B3',
          silver: '#C5C6C7',
          platinum: '#E5E5E5',
          bronze: '#8C7853',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Didot', 'serif'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'widest-lux': '0.35em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
