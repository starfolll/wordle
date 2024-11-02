import type { AnyStoreItemData } from 'types.app'
import { prismaClient } from 'prisma-client'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

export const getItemsInStore = authorizedProcedure
  .query(async (): Promise<AnyStoreItemData[]> => {
    return await prismaClient.storeItem.findMany({
      where: {
        inStore: true,
      },
      select: {
        id: true,

        category: true,
        name: true,
        subCategory: true,
        price: true,

        data: true,
      },
    }) as unknown as AnyStoreItemData[]
  })
