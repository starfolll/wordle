import type { ShopItemData, TShopItemCategoryData } from '../shop-item'

export interface TShopItemBackgroundData extends ShopItemData {
  category: TShopItemCategoryData['background']

  data: {
    background: string
  }
}
