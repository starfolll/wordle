import { TRPCError } from '@trpc/server'
import { getMonday, getSunday, getToday } from 'dates'
import { encryptWord } from 'encryption'
import { prismaClient } from 'prisma-client'
import { GameProgressType, type GamesProgressData } from '../../../../libs/types'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

const select = {
  id: true,

  streak: true,

  word: true,
  hint: true,

  guesses: true,
  maxGuesses: true,
} as const

export const dailyChallengeSelect = {
  id: true,

  date: true,

  isCompleted: true,
  isWon: true,

  word: true,
  hint: true,

  guesses: true,
  maxGuesses: true,
}

export const getGamesProgress = authorizedProcedure
  .query(async (opts): Promise<GamesProgressData> => {
    const today = getToday()
    const monday = getMonday(today)
    const sunday = getSunday(today)

    const userGameProgress = await prismaClient.user.findUnique({
      where: { id: opts.ctx.user.id },
      select: {
        classicFourLettersGameProgress: { select },
        classicFiveLettersGameProgress: { select },
        dailyChallengeWordGameProgress: {
          where: {
            date: {
              gte: monday,
              lte: sunday,
            },
          },
          select: dailyChallengeSelect,
        },
        withHintGameProgress: { select },
      },
    })

    if (!userGameProgress) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User game progress not found',
      })
    }

    const encryptUserWord = (word: string) => encryptWord(word, opts.ctx.user.token)

    userGameProgress.classicFourLettersGameProgress.word.word
    = encryptUserWord(userGameProgress.classicFourLettersGameProgress.word.word)

    userGameProgress.classicFiveLettersGameProgress.word.word
    = encryptUserWord(userGameProgress.classicFiveLettersGameProgress.word.word)

    userGameProgress.dailyChallengeWordGameProgress.map((dailyChallengeGameProgress) => {
      dailyChallengeGameProgress.word.word = encryptUserWord(dailyChallengeGameProgress.word.word)
      return dailyChallengeGameProgress
    })

    userGameProgress.withHintGameProgress.word.word
    = encryptUserWord(userGameProgress.withHintGameProgress.word.word)

    const dailyChallengesGameProgress = userGameProgress.dailyChallengeWordGameProgress
      .reduce((acc, gameProgress) => {
        (acc as any)[gameProgress.date.toISOString()] = {
          ...gameProgress,
          gameType: GameProgressType.dailyChallengeGameProgress,
          date: today.toISOString(),
        }
        return acc
      }, {} as GamesProgressData['dailyChallengesGameProgress'])

    return {
      classicFiveLettersGameProgress: {
        ...userGameProgress.classicFiveLettersGameProgress,
        gameType: GameProgressType.classicFiveLettersGameProgress,
      },
      classicFourLettersGameProgress: {
        ...userGameProgress.classicFourLettersGameProgress,
        gameType: GameProgressType.classicFourLettersGameProgress,
      },
      dailyChallengesGameProgress,
      withHintGameProgress: {
        ...userGameProgress.withHintGameProgress,
        gameType: GameProgressType.withHintGameProgress,
      },
    }
  })
