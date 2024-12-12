import type { ShopItemData, TShopItemCategoryData } from '../shop-item'

export interface TShopItemStickerData extends ShopItemData {
  category: TShopItemCategoryData['sticker']

  data: {
    stickerUrl: string
  }
}
