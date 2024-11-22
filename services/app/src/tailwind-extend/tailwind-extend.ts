import type { CustomThemeConfig, PluginsConfig } from 'tailwindcss/types/config'
import { current } from './color/current'
import { pluginScrollbarHeight } from './scrollbar/scrollbar-height'
import { pluginScrollbarWidth } from './scrollbar/scrollbar-width'

export const tailwindExtend = {
  colors: {
    current,
  },
} as const satisfies Partial<CustomThemeConfig>

export const tailwindPlugins = [
  pluginScrollbarHeight,
  pluginScrollbarWidth,
] satisfies PluginsConfig
