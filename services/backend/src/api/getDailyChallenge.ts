import type { DailyChallengeData } from 'types.app'
import { TRPCError } from '@trpc/server'
import { prismaClient } from 'prisma-client'
import { authorizedProcedure } from '../procedures/authorized.prcdr'

let cachedDailyChallenge: DailyChallengeData | null = null

function setCachedDailyChallenge(dailyChallenge: DailyChallengeData) {
  return cachedDailyChallenge = {
    date: dailyChallenge.date,
    word: {
      length: dailyChallenge.word.length,
      learnLevel: dailyChallenge.word.learnLevel,
    },
  }
}

export const getDailyChallenge = authorizedProcedure
  .query(async (): Promise<DailyChallengeData> => {
    const now = new Date(Date.now())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (cachedDailyChallenge?.date.getTime() === today.getTime())
      return cachedDailyChallenge

    const dailyWord = await prismaClient.dailyChallengeWord.findUnique({
      where: { date: today },
      include: { word: true },
    })

    if (dailyWord)
      return setCachedDailyChallenge({ date: today, word: dailyWord.word })

    const wordInfo = await prismaClient.word.findRandom()

    if (!wordInfo) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No words found',
      })
    }

    await prismaClient.dailyChallengeWord.create({
      data: {
        date: today,
        word: { connect: { word: wordInfo.word } },
      },
    })

    return setCachedDailyChallenge({ date: today, word: wordInfo })
  })
