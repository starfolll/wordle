import type { CustomThemeConfig } from 'tailwindcss/types/config'
import { current } from './color/current'

export const tailwindExtend = {
  colors: {
    current,
  },
} as const satisfies Partial<CustomThemeConfig>
