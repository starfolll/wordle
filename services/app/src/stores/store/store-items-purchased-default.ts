import { type AnyStoreItemData, type AnyUniquelySelectableStoreItemData, StoreItemCategoryData, type TStoreItemCategoryData } from 'types.app'

export const storeItemsPurchasedDefault = {
  background_default: {
    id: 'background_default',
    category: StoreItemCategoryData.background,
    name: 'Dark',
    price: 0,
    subCategory: 'default',
    data: {
      background: '#171717',
    },
  },

  theme_default: {
    id: 'theme_default',
    subCategory: StoreItemCategoryData.theme,
    name: 'Default',
    price: 0,
    category: 'theme',
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

  font_default: {
    id: 'font_default',
    category: StoreItemCategoryData.font,
    name: 'Default',
    price: 0,
    subCategory: 'default',
    data: {
      fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
      fontName: '""',
    },
  },
} satisfies {
  [_key in AnyUniquelySelectableStoreItemData as AnyStoreItemData['id']]: Extract<
    AnyStoreItemData,
    { category: TStoreItemCategoryData[_key['category']] }
  >
}
