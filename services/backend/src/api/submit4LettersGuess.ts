import { prismaClient } from 'prisma-client'
import { z } from 'zod'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

export const submit4LetterGuess = authorizedProcedure
  .input(z.string())
  .mutation(async (opts) => {
    const user = opts.ctx.user

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        classicFourLettersGameProgress: {
          update: {
            guesses: {
              push: opts.input,
            },
          },
        },
      },
    })

    return 'ok'
  })
