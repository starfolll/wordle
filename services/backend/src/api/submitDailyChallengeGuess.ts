import { TRPCError } from '@trpc/server'
import { getToday } from 'dates'
import { type DailyChallengeWordGameProgress, prismaClient } from 'prisma-client'
import { z } from 'zod'
import { authorizedProcedure } from '../procedures/authorized.prcdr'
import { dailyChallengeSelect } from './getGamesProgress'

export const submitDailyChallengeGuess = authorizedProcedure
  .input(z.object({
    guess: z.string(),
  }))
  .mutation(async (opts): Promise<Pick<DailyChallengeWordGameProgress, 'isCompleted' | 'isWon'>> => {
    const user = opts.ctx.user
    const { guess } = opts.input

    const today = getToday()

    const gameProgress = await prismaClient.dailyChallengeWordGameProgress.findFirst({
      where: {
        userId: user.id,
        date: today,
      },

      select: dailyChallengeSelect,
    })

    if (!gameProgress) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Game progress not found',
      })
    }

    if (gameProgress.maxGuesses <= gameProgress.guesses.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You have reached the maximum number of guesses',
      })
    }

    if (gameProgress.word.length !== guess.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid guess length',
      })
    }

    if (gameProgress.guesses.includes(guess)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You have already guessed this word',
      })
    }

    const isWon = gameProgress.word.word === guess
    const isCompleted = gameProgress.maxGuesses <= gameProgress.guesses.length + 1 || isWon

    await prismaClient.dailyChallengeWordGameProgress.update({
      where: { id: gameProgress.id },
      data: {
        guesses: {
          push: guess,
        },
        isCompleted,
        isWon,
      },
    })

    return {
      isWon,
      isCompleted,
    }
  })
