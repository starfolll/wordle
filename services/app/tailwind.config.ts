import type { Config } from 'tailwindcss'
import { tailwindExtend, tailwindPlugins } from './src/tailwind-extend/tailwind-extend'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: tailwindExtend,
  },
  plugins: tailwindPlugins,
} satisfies Config
