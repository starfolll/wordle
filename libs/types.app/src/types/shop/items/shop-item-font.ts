import type { ShopItemData, TShopItemCategoryData } from '../shop-item'

export const ShopItemFontName = Object.freeze({
  _default: '_default',
  FuzzyBubbles: 'FuzzyBubbles',
})

export type TShopItemFontName = keyof typeof ShopItemFontName

export interface TShopItemFontData extends ShopItemData {
  category: TShopItemCategoryData['font']

  data: {
    fontName: keyof typeof ShopItemFontName
  }
}
