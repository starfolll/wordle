import type { PluginCreator } from 'tailwindcss/types/config'

export const pluginScrollbarHeight: PluginCreator = ({ addUtilities }) => {
  addUtilities({
    '.scrollbar-height-0': {
      '&::-webkit-scrollbar': {
        height: '0',
      },
    },
  })
}
