import type { Words } from '@prisma/client'
import { prismaClient } from '../../prisma/client'

const anyWord = () => prismaClient.$queryRaw<Words[]>`SELECT * FROM "Words" ORDER BY RANDOM() LIMIT 1`
const anyWordWithLength = (length: number) => prismaClient.$queryRaw<Words[]>`SELECT * FROM "Words" WHERE length = ${length} ORDER BY RANDOM() LIMIT 1`
export async function getRandomWordInfo(length?: number) {
  const words = length ? await anyWordWithLength(length) : await anyWord()

  return words[0]
}
