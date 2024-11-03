import type { AnyStoreItemData, UserInventoryData } from 'types.app'
import { TRPCError } from '@trpc/server'
import { prismaClient } from 'prisma-client'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

const anyStoreItemSelect = {
  id: true,

  category: true,
  name: true,
  subCategory: true,
  price: true,

  data: true,
} as const satisfies Record<keyof AnyStoreItemData, true>

export const getUserInventory = authorizedProcedure
  .query(async (opts): Promise<UserInventoryData> => {
    const user = opts.ctx.user

    const userData = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: {
        coins: true,
        diamonds: true,

        purchasedStoreItems: { select: anyStoreItemSelect },
      },
    })

    if (!userData) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      })
    }

    return {
      coins: userData.coins,
      diamonds: userData.diamonds,
      purchasedStoreItems: userData.purchasedStoreItems as AnyStoreItemData[],
    }
  })
