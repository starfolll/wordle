import type { CustomThemeConfig } from 'tailwindcss/types/config'

export const current = {
  100: `rgb(var(--color-current-100) / <alpha-value>)`,
  200: `rgb(var(--color-current-200) / <alpha-value>)`,
  300: `rgb(var(--color-current-300) / <alpha-value>)`,
  400: `rgb(var(--color-current-400) / <alpha-value>)`,
  500: `rgb(var(--color-current-500) / <alpha-value>)`,
  600: `rgb(var(--color-current-600) / <alpha-value>)`,
  700: `rgb(var(--color-current-700) / <alpha-value>)`,
  800: `rgb(var(--color-current-800) / <alpha-value>)`,
  900: `rgb(var(--color-current-900) / <alpha-value>)`,
} as const satisfies CustomThemeConfig['colors']
