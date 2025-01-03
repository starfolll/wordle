/* eslint-disable no-console */
/* eslint-disable antfu/no-top-level-await */
import type { LearnLevel, Word } from '@prisma/client'
import { parse } from 'node-html-parser'
import { queryCreateTables } from './db/create-tables'
import { queryInsertWord } from './db/insert-word'

const wordsDataUrl = new URL('http://www.wordcyclopedia.com/english/')
const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as LearnLevel[]

function isWordAllowed(word: string) {
  return /^[a-z]{3,}$/.test(word)
}

async function fetchWordByLearnLevel(learnLevel: LearnLevel): Promise<Word[]> {
  const url = new URL(learnLevel, wordsDataUrl)

  const request = await fetch(url.toString())
  const text = await request.text()

  const htmlRoot = parse(text)
  const words = htmlRoot.querySelectorAll('.word')

  const wordsData: Word[] = []

  words.forEach((word) => {
    if (isWordAllowed(word.text)) {
      wordsData.push({
        learnLevel,
        word: word.textContent,
        length: word.text.length,
      })
    }
  })

  return wordsData
}

async function scrapeWords() {
  console.log('Scraping words...')

  for (const level of levels) {
    console.log(`Scraping words for level ${level}...`)

    const words = await fetchWordByLearnLevel(level)

    console.log(`Fetched ${words.length} words for level ${level}, count: ${words.length}`)

    for (const word of words) queryInsertWord(word)
  }
}

await queryCreateTables()
await scrapeWords()
