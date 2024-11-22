import type { Config } from 'tailwindcss'
import { tailwindExtend } from './src/tailwind-extend/tailwind-extend'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: tailwindExtend,
  },
  plugins: [],
} satisfies Config
