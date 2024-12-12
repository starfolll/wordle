import type { ShopItemData, TShopItemCategoryData } from '../shop-item'

export interface TShopItemThemeData extends ShopItemData {
  category: TShopItemCategoryData['theme']

  data: {
    themeVariables: Record<string, string>
  }
}
