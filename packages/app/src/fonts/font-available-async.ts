import { ShopItemFontName } from 'types.app'
import { defineAsyncComponent } from 'vue'

import DefaultFont from './in-public/_default-font'

export const fontAvailableAsync = Object.freeze({
  [ShopItemFontName._default]: DefaultFont,
  [ShopItemFontName.FuzzyBubbles]: defineAsyncComponent(() => import('./in-public/fuzzy-bubbles')),
} satisfies Record<
  keyof typeof ShopItemFontName,
  ReturnType<typeof defineAsyncComponent>
>)
