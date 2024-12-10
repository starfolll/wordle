import { prismaClient } from 'prisma-client'

export async function getRandomWord(length?: number) {
  const randomWord = length
    ? await prismaClient.word.findRandom({ where: { length } })
    : await prismaClient.word.findRandom()

  return randomWord
}
