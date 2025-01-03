/* eslint-disable no-console */
import { prismaClient } from 'prisma-client'
import { shopItemsBackgrounds } from '../shop-items/backgrounds'
import { shopItemsFonts } from '../shop-items/fonts'
import { shopItemsStickers } from '../shop-items/stickers'
import { shopItemsThemes } from '../shop-items/themes'

const allShopItems = [
  ...shopItemsBackgrounds,
  ...shopItemsStickers,
  ...shopItemsThemes,
  ...shopItemsFonts,
]

export async function dbPopulateShopItems() {
  for (const shopItem of allShopItems) {
    await prismaClient.shopItem.upsert({
      where: { id: shopItem.id },
      update: shopItem,
      create: shopItem,
    })

    console.log(`Inserted ${shopItem.id}`)
  }
}
