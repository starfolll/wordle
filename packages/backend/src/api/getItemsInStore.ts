import type { TAnyShopItemData } from '../../../../libs/types'
import { prismaClient } from 'prisma-client'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

export const getItemsInShop = authorizedProcedure
  .query(async (): Promise<TAnyShopItemData[]> => {
    return await prismaClient.shopItem.findMany({
      where: {
        inShop: true,
      },
      select: {
        id: true,

        category: true,
        name: true,
        subCategory: true,
        price: true,

        data: true,
      },
    }) as unknown as TAnyShopItemData[]
  })
