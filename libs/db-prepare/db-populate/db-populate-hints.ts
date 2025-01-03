/* eslint-disable no-console */
import type { TScrappedWordHint } from '../scrappers/db/types/scrraped-word-hint'
import { prismaClient } from 'prisma-client'
import { querySelectAllHints } from '../scrappers/db/select-all-hints'
import { querySelectCountHints } from '../scrappers/db/select-count-hints'

async function upsertHint(hint: TScrappedWordHint) {
  await prismaClient.wordHint.upsert({
    where: { hash: hint.hash },
    update: {
      hint: hint.hint,
      hash: hint.hash,
      length: hint.length,
      source: hint.source,

      word: { connect: { word: hint.word } },
    },
    create: {
      hint: hint.hint,
      hash: hint.hash,
      length: hint.length,
      source: hint.source,

      word: { connect: { word: hint.word } },
    },
  })
}

export async function dbPopulateHints() {
  console.log('Populating hints...')

  const maxConcurrentUpsert = 100

  const hintsCount = querySelectCountHints()
  const hintsQuery = querySelectAllHints()

  let i = 0
  let concurrentUpsert = 0
  let upsert: Promise<void>[] = []

  for await (const hint of hintsQuery.iterate()) {
    upsert.push(upsertHint(hint))

    if (concurrentUpsert >= maxConcurrentUpsert) {
      await Promise.all(upsert)
      upsert = []
      concurrentUpsert = 0
    }

    if (i % 100 === 0) {
      const progress = ((i / hintsCount) * 100).toFixed(2)
      console.log(`Progress: ${progress}%`)
    }

    i++
    concurrentUpsert++
  }

  await Promise.all(upsert)
}
