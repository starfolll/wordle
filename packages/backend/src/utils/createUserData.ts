import type { TUserLoginData } from '../../../../libs/types'
import { TRPCError } from '@trpc/server'
import { prismaClient } from 'prisma-client'

export async function createUserData(): Promise<TUserLoginData> {
  const [wordWithLength4, wordWithLength5, anyRandomWord] = await Promise.all([
    await prismaClient.word.findRandom({ where: { length: 4 } }),
    await prismaClient.word.findRandom({ where: { length: 5 } }),
    await prismaClient.word.findRandom(),
  ])

  if (!wordWithLength4 || !wordWithLength5 || !anyRandomWord)
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

  const randomWordHint = await prismaClient.wordHint.findRandom()

  if (!randomWordHint)
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

  return prismaClient.user.create({
    data: {
      name: `User${Math.floor(Math.random() * 1000000)}`,
      diamonds: 2,
      coins: 24,

      classicFourLettersGameProgress: { create: {
        maxGuesses: 5,
        word: { connect: { word: wordWithLength4.word } },
      } },
      classicFiveLettersGameProgress: { create: {
        maxGuesses: 6,
        word: { connect: { word: wordWithLength5.word } },
      } },
      withHintGameProgress: { create: {
        maxGuesses: 3,
        word: { connect: { word: anyRandomWord.word } },
        hint: { connect: { id: randomWordHint.id } },
      } },
    },

    select: {
      id: true,
      token: true,
      name: true,
    },
  })
}
