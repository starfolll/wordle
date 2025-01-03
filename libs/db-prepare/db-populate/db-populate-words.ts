/* eslint-disable no-console */
import type { Word } from '@prisma/client'
import { prismaClient } from 'prisma-client'
import { querySelectAllWords } from '../scrappers/db/select-all-words'
import { querySelectCountWord } from '../scrappers/db/select-count-word'

async function upsertWord(word: Word) {
  await prismaClient.word.upsert({
    where: { word: word.word },
    update: word,
    create: word,
  })
}

export async function dbPopulateWords() {
  console.log('Populating words...')

  const wordsCount = querySelectCountWord()
  const wordsQuery = querySelectAllWords()

  let i = 0
  for (const word of wordsQuery.iterate()) {
    const progress = ((i / wordsCount) * 100).toFixed(2)

    await upsertWord(word)

    if (i % 100 === 0) {
      console.log(`Progress: ${progress}%`)
    }

    i++
  }
}
