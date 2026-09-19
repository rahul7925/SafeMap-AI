/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        safe: {
          DEFAULT: '#16A34A',
          bg: '#DCFCE7',
          text: '#15803D',
        },
        moderate: {
          DEFAULT: '#CA8A04',
          bg: '#FEF9C3',
          text: '#A16207',
        },
        high: {
          DEFAULT: '#EA580C',
          bg: '#FFEDD5',
          text: '#C2410C',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: '#FEE2E2',
          text: '#B91C1C',
        },
      }
    },
  },
  plugins: [],
};
