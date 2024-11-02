import type { Prisma } from '@prisma/client'
import type { StoreItemCategory } from 'prisma-client'

export const StoreItemCategoryData = {
  background: 'background',
  theme: 'theme',
  font: 'font',
  sticker: 'sticker',
} as const

export type TStoreItemCategoryData = typeof StoreItemCategoryData

export interface StoreItemData {
  id: string

  category: StoreItemCategory
  name: string
  subCategory: string
  price: number

  data: Prisma.JsonValue
}

export interface StoreItemBackgroundData extends StoreItemData {
  category: TStoreItemCategoryData['background']

  data: {
    background: string
  }
}

export interface StoreItemThemeData extends StoreItemData {
  category: TStoreItemCategoryData['theme']

  data: {
    themeVariables: Record<string, string>
  }
}

export interface StoreItemFontData extends StoreItemData {
  category: TStoreItemCategoryData['font']

  data: {
    fontUrl: string
    fontName: string
  }
}

export interface StoreItemStickerData extends StoreItemData {
  category: TStoreItemCategoryData['sticker']

  data: {
    stickerUrl: string
  }
}

export type AnyUniquelySelectableStoreItemData =
  | StoreItemBackgroundData
  | StoreItemThemeData
  | StoreItemFontData

export type AnyStoreItemData =
  | StoreItemBackgroundData
  | StoreItemThemeData
  | StoreItemFontData
  | StoreItemStickerData
