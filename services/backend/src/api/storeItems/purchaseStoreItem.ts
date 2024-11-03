import { TRPCError } from '@trpc/server'
import { prismaClient } from 'prisma-client'
import { z } from 'zod'
import { authorizedProcedure } from '../../procedures/authorized.prcdr'

export const purchaseStoreItem = authorizedProcedure
  .input(z.object({
    itemId: z.string(),
  }))
  .mutation(async (opts) => {
    const user = opts.ctx.user
    const { itemId } = opts.input

    const item = await prismaClient.storeItem.findUnique({
      where: {
        id: itemId,
        usersPurchased: {
          none: {
            id: user.id,
          },
        },
      },
    })

    if (!item) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Item already purchased or item not found',
      })
    }

    const userData = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: { coins: true },
    })

    if (!userData) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      })
    }

    if (item.price > userData.coins) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Insufficient balance',
      })
    }

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        coins: {
          decrement: item.price,
        },
        purchasedStoreItems: {
          connect: {
            id: item.id,
          },
        },
      },
    })
  })
