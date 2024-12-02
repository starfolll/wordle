import { TRPCError } from '@trpc/server'
import { prismaClient } from 'prisma-client'
import { type TGameProgressData, GameProgressType } from 'types.app'
import { z } from 'zod'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

const allowedGameTypes = [
  GameProgressType.classicFiveLettersGameProgress,
  GameProgressType.classicFourLettersGameProgress,
  GameProgressType.withHintGameProgress,
] as const

type AllowedGameTypes = Extract<TGameProgressData, { gameType: typeof allowedGameTypes[number] }>

export const submitGuess = authorizedProcedure
  .input(z.object({
    gameType: z.enum(allowedGameTypes),
    guess: z.string().regex(/^[a-z]+$/),
  }))
  .mutation(async (opts): Promise<{
    isGameOver: boolean
    isWon: boolean
  }> => {
    const user = opts.ctx.user
    const { guess, gameType } = opts.input

    const userGameProgress = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: {
        [gameType]: {
          select: {
            word: true,
            guesses: true,
            maxGuesses: true,
          },
        },
      },
    })

    if (!userGameProgress) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User game progress not found',
      })
    }

    const gameProgress = userGameProgress[gameType] as unknown as AllowedGameTypes

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

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        [gameType]: {
          update: {
            guesses: {
              push: guess,
            },
          },
        },
      },
      select: {
        [gameType]: {
          select: {
            guesses: true,
          },
        },
      },
    })

    const isWon = gameProgress.word.word === guess

    return {
      isWon,
      isGameOver: gameProgress.maxGuesses <= gameProgress.guesses.length + 1 || isWon,
    }
  })
