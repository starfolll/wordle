import { type AnyShopItemData, type AnyUniquelySelectableShopItemData, ShopItemCategoryData, type TShopItemCategoryData } from 'types.app'

export const shopItemsPurchasedDefault = {
  background: {
    id: '',
    category: ShopItemCategoryData.background,
    name: 'Dark',
    price: 0,
    subCategory: 'default',
    data: {
      background: '#171717',
    },
  },

  theme: {
    id: '',
    category: ShopItemCategoryData.theme,
    name: 'Default',
    price: 0,
    subCategory: 'tail',
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
    id: '',
    category: ShopItemCategoryData.font,
    name: 'Default',
    price: 0,
    subCategory: 'default',
    data: {
      fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
      fontName: '""',
    },
  },
} satisfies {
  [_key in AnyUniquelySelectableShopItemData['category']]: Extract<
    AnyShopItemData,
    { category: TShopItemCategoryData[_key] }
  >
}
