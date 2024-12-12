import type { Prisma, ShopItemCategory } from 'prisma-client'
import type { TShopItemBackgroundData } from './items/shop-item-background'
import type { TShopItemFontData } from './items/shop-item-font'
import type { TShopItemStickerData } from './items/shop-item-sticker'
import type { TShopItemThemeData } from './items/shop-item-theme'

export const ShopItemCategoryData = {
  background: 'background',
  theme: 'theme',
  font: 'font',
  sticker: 'sticker',
} as const

export type TShopItemCategoryData = typeof ShopItemCategoryData

export interface ShopItemData {
  id: string

  category: ShopItemCategory
  name: string
  subCategory: string
  price: number

  data: Prisma.JsonValue
}

export const UniquelySelectableShopItemCategory = [
  ShopItemCategoryData.background,
  ShopItemCategoryData.theme,
  ShopItemCategoryData.font,
] as const

export type TAnyUniquelySelectableShopItemData =
  | TShopItemBackgroundData
  | TShopItemThemeData
  | TShopItemFontData

export type TAnyShopItemData =
  | TShopItemBackgroundData
  | TShopItemThemeData
  | TShopItemFontData
  | TShopItemStickerData
