import { TRPCError } from '@trpc/server'
import { getToday } from 'dates'
import { encryptWord } from 'encryption'
import { prismaClient } from 'prisma-client'
import { type DailyChallengeGameProgressData, GameProgressType } from '../../../../libs/types'
import { authorizedProcedure } from '../procedures/authorized.prcdr'
import { getDefaultMaxGuesses } from '../utils/defaultWordLength'
import { getRandomWord } from '../utils/getRandomWord'
import { dailyChallengeSelect } from './getGamesProgress'

async function setDailyChallengeWord(userId: string, date: Date) {
  const randomWord = await getRandomWord()

  if (!randomWord) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get new word',
    })
  }

  const { word } = randomWord

  const gameProgress = await prismaClient.dailyChallengeWordGameProgress.create({
    data: {
      user: { connect: { id: userId } },
      date,
      word: { connect: { word } },
      guesses: [],
      maxGuesses: getDefaultMaxGuesses(GameProgressType.dailyChallengeGameProgress, word),
    },
    select: dailyChallengeSelect,
  })

  return gameProgress
}

export const getDailyChallengeWord = authorizedProcedure
  .query(async (opts): Promise<DailyChallengeGameProgressData> => {
    const user = opts.ctx.user
    const today = getToday()

    const dailyChallenge = await prismaClient.dailyChallengeWordGameProgress.findFirst({
      where: {
        userId: opts.ctx.user.id,
        date: today,
      },
      select: dailyChallengeSelect,
    })

    const gameProgress = dailyChallenge || await setDailyChallengeWord(user.id, today)

    return {
      ...gameProgress,
      gameType: GameProgressType.dailyChallengeGameProgress,
      date: today.toISOString(),
      word: {
        ...gameProgress.word,
        word: encryptWord(gameProgress.word.word, user.token),
      },
    }
  })
