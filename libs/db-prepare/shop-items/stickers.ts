import type { TShopItemStickerData } from '../../types'
import { ShopItemCategory } from 'prisma-client'

export const shopItemsStickers: TShopItemStickerData[] = [{
  id: 'sticker_halloween_2025_ghost',
  name: 'Ghost',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/ghost.png',
  },
}, {
  id: 'sticker_halloween_2025_green_potion',
  name: 'Green Potion',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/green-potion.png',
  },
}, {
  id: 'sticker_halloween_2025_haunted_house',
  name: 'Haunted House',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/haunted-house.png',
  },
}, {
  id: 'sticker_halloween_2025_pumpkin',
  name: 'Pumpkin',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/pumpkin.png',
  },
}, {
  id: 'sticker_halloween_2025_purple_potion',
  name: 'Purple Potion',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/purple-potion.png',
  },
}, {
  id: 'sticker_halloween_2025_spiders',
  name: 'Spiders',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/spiders.png',
  },
}, {
  id: 'sticker_halloween_2025_witch_hat',
  name: 'Witch Hat',
  price: 10,
  subCategory: 'halloween',
  category: ShopItemCategory.sticker,
  data: {
    stickerUrl: 'halloween_2025/witch-hat.png',
  },
}]
