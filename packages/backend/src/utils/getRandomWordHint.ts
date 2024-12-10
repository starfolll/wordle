import { prismaClient } from 'prisma-client'

export function getRandomWordHint(word: string) {
  return prismaClient.wordHint.findFirst({
    where: {
      word: {
        word,
      },
    },
  })
}
