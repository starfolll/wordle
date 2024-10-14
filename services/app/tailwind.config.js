/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        current: {
          100: `rgb(var(--color-current-100))`,
          200: `rgb(var(--color-current-200))`,
          300: `rgb(var(--color-current-300))`,
          400: `rgb(var(--color-current-400))`,
          500: `rgb(var(--color-current-500))`,
          600: `rgb(var(--color-current-600))`,
          700: `rgb(var(--color-current-700))`,
          800: `rgb(var(--color-current-800))`,
          900: `rgb(var(--color-current-900))`,
        },
      },
    },
  },
  plugins: [],
}
