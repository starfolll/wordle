import { TRPCError } from '@trpc/server'
import { encryptWord } from 'encryption'
import { prismaClient } from 'prisma-client'
import { type TGameProgressData, GameProgressType, type TGameProgressType } from 'types.app'
import { z } from 'zod'
import { authorizedProcedure } from '../procedures/authorized.prcdr'
import { defaultWordLength, getDefaultMaxGuesses } from '../utils/defaultWordLength'
import { getRandomWord } from '../utils/getRandomWord'
import { getRandomWordHint } from '../utils/getRandomWordHint'

const allowedGameTypes = [
  GameProgressType.classicFiveLettersGameProgress,
  GameProgressType.classicFourLettersGameProgress,
  GameProgressType.withHintGameProgress,
] as const

type AllowedGameType = Extract<TGameProgressData, { gameType: typeof allowedGameTypes[number] }>

export const getNextWord = authorizedProcedure
  .input(z.object({
    gameType: z.enum(allowedGameTypes),
  }))
  .query(async (opts): Promise<AllowedGameType> => {
    const user = opts.ctx.user
    const gameType = opts.input.gameType as typeof allowedGameTypes[number]

    const userGameProgress = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: {
        [gameType as TGameProgressType['classicFourLettersGameProgress']]: {
          select: {
            id: true,
            streak: true,
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

    const gameProgress = userGameProgress[gameType as TGameProgressType['classicFourLettersGameProgress']]

    if (!gameProgress) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Game progress not found',
      })
    }

    const isWon = gameProgress.guesses.includes(gameProgress.word.word)
    const isGameOver = gameProgress.maxGuesses <= gameProgress.guesses.length || isWon

    if (!isGameOver) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Game is not over',
      })
    }

    const word = await getRandomWord(defaultWordLength[gameType])

    if (!word) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get new word',
      })
    }

    const streak = isWon ? gameProgress.streak + 1 : 0
    const maxGuesses = getDefaultMaxGuesses(gameType, word.word)

    const hint = gameType === GameProgressType.withHintGameProgress
      ? await getRandomWordHint(word.word)
      : null

    if (gameType === GameProgressType.withHintGameProgress && !hint) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get new hint',
      })
    }

    await prismaClient.user.update({
      where: { id: user.id },

      data: {
        coins: {
          increment: isWon ? 1 : 0,
        },
        [gameType as TGameProgressType['classicFourLettersGameProgress']]: {
          update: {
            streak,
            word: { connect: { word: word.word } },
            hint: hint ? { connect: { id: hint.id } } : { disconnect: true },
            maxGuesses,
            guesses: [],
          },
        },
      },

      select: {
        id: true,
      },
    })

    return {
      id: gameProgress.id,
      gameType: gameType as any,
      streak,
      word: {
        ...word,
        word: encryptWord(word.word, user.token),
      },
      guesses: [],
      maxGuesses,
      hint,
    }
  })
