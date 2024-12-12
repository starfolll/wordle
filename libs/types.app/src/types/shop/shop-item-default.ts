import { ShopItemCategoryData, ShopItemFontName, type TAnyShopItemData, type TAnyUniquelySelectableShopItemData, type TShopItemCategoryData } from '../../..'

const ShopItemDefaultBackgroundId = '_background_default' as const
const ShopItemDefaultThemeId = '_theme_default' as const
const ShopItemDefaultFontId = '_font_default' as const

export const ShopItemDefault = {
  background: {
    id: ShopItemDefaultBackgroundId,
    category: ShopItemCategoryData.background,
    name: 'Dark',
    price: 0,
    subCategory: 'default',
    data: {
      background: '#171717',
    },
  },

  theme: {
    id: ShopItemDefaultThemeId,
    category: ShopItemCategoryData.theme,
    name: 'Neutral',
    price: 0,
    subCategory: 'default',
    data: {
      themeVariables: {
        '--color-current-100': '245 245 245',
        '--color-current-200': '229 229 229',
        '--color-current-300': '212 212 212',
        '--color-current-400': '163 163 163',
        '--color-current-500': '115 115 115',
        '--color-current-600': '82 82 82',
        '--color-current-700': '64 64 64',
        '--color-current-800': '38 38 38',
        '--color-current-900': '23 23 23',
      },
    },
  },

  font: {
    id: ShopItemDefaultFontId,
    category: ShopItemCategoryData.font,
    name: 'Default',
    price: 0,
    subCategory: 'default',
    data: {
      fontName: ShopItemFontName._default,
    },
  },
} satisfies {
  [_key in TAnyUniquelySelectableShopItemData['category']]: Extract<
    TAnyShopItemData,
    { category: TShopItemCategoryData[_key] }
  >
}
