import type { TShopItemBackgroundData } from 'types.app'
import { ShopItemCategory } from 'prisma-client'

export const shopItemsBackgrounds: TShopItemBackgroundData[] = [{
  id: 'background_fall',
  name: 'Fall',
  price: 10,
  category: ShopItemCategory.background,
  subCategory: '4 seasons',
  data: {
    background: 'linear-gradient(to left top, #e9b91c, #ae1324)',
  },
}, {
  id: 'background_winter',
  name: 'Winter',
  price: 10,
  category: ShopItemCategory.background,
  subCategory: '4 seasons',
  data: {
    background: 'linear-gradient(to left top, #E6DADA, #272846)',
  },
}, {
  id: 'background_spring',
  name: 'Spring',
  price: 10,
  category: ShopItemCategory.background,
  subCategory: '4 seasons',
  data: {
    background: `linear-gradient(to left top, #fad0c4, #fad0c4, #ffd1ff)`,
  },
}, {
  id: 'background_summer',
  name: 'Summer',
  price: 10,
  category: ShopItemCategory.background,
  subCategory: '4 seasons',
  data: {
    background: 'linear-gradient(to left top, #22c1c3, #fdbb2d)',
  },
}]
