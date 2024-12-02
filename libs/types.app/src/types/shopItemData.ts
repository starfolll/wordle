import type { Prisma } from '@prisma/client'
import type { ShopItemCategory } from 'prisma-client'

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

export interface TShopItemBackgroundData extends ShopItemData {
  category: TShopItemCategoryData['background']

  data: {
    background: string
  }
}

export interface TShopItemThemeData extends ShopItemData {
  category: TShopItemCategoryData['theme']

  data: {
    themeVariables: Record<string, string>
  }
}

export interface TShopItemFontData extends ShopItemData {
  category: TShopItemCategoryData['font']

  data: {
    fontUrl: string
    fontName: string
  }
}

export interface TShopItemStickerData extends ShopItemData {
  category: TShopItemCategoryData['sticker']

  data: {
    stickerUrl: string
  }
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
