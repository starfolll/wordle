import type { TShopItemFontName } from 'types'
import { h } from 'vue'

export interface TLocalFont {
  fontWeights: number[]
  src: string
  fontStyles?: string
}

export function fontGetStyleComponent(options: {
  fontFamily: TShopItemFontName
  localFonts: TLocalFont[]
}) {
  const declaredStyles = options.localFonts.map(localFont => `
    @font-face {
      font-family: ${options.fontFamily};
      font-weight: ${localFont.fontWeights.join(' ')};
      src: url('${localFont.src}');
      font-style: ${localFont.fontStyles || 'normal'};
    }
  `).join('\n')

  return h('style', {}, declaredStyles)
}
