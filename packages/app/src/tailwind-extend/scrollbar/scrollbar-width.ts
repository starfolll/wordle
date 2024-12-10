import type { PluginCreator } from 'tailwindcss/types/config'

export const pluginScrollbarWidth: PluginCreator = ({ addUtilities }) => {
  addUtilities({
    '.scrollbar-width-0': {
      '&::-webkit-scrollbar': {
        width: '0',
      },
    },
  })
}
