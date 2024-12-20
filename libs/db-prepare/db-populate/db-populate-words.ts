/* eslint-disable no-console */
import type { LearnLevel, Word } from '@prisma/client'
import { prismaClient } from 'prisma-client'

import { a1 } from '../words/a1'
import { a2 } from '../words/a2'
import { b1 } from '../words/b1'
import { b2 } from '../words/b2'
import { c1 } from '../words/c1'
import { c2 } from '../words/c2'

export type TWordInfo = {
  word: string
  hint: string
  length: number
  learnLevel: LearnLevel
}

async function upsertWord(word: Word) {
  await prismaClient.word.upsert({
    where: { word: word.word },
    update: word,
    create: {
      ...word,
      hints: {
        create: {
          hint: 'No hints yet',
        },
      },
    },
  })
}

async function upsertWords(wordsInfo: TWordInfo[]) {
  console.log(`Populating words ${wordsInfo.length}...`)

  for (let i = 0; i < wordsInfo.length; i++) {
    const word = wordsInfo[i]
    const percent = ((i + 1) / wordsInfo.length) * 100

    if (i % 100 === 0) {
      console.log(`Progress: ${percent.toFixed(2)}%`)
    }

    await upsertWord({
      word: word.word,
      length: word.length,
      learnLevel: word.learnLevel,
    })
  }
}

export async function dbPopulateWords() {
  await upsertWords([
    a1,
    a2,
    b1,
    b2,
    c1,
    c2,
  ].flat())
}
