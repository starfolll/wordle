/* eslint-disable antfu/no-top-level-await */
/* eslint-disable no-console */
import type { learnLevel, Words } from '@prisma/client'
import { parse } from 'node-html-parser'

async function fetchWordInfo(word: string): Promise<Pick<Words, 'hint' | 'word'>> {
  const vocabulary = await fetch(`http://www.wordcyclopedia.com/english?${word}`)
  const html = await vocabulary.text()
  const root = parse(html)

  const hint = (
    root.querySelector('.entryDY .definition.hasThermo .value')
    || root.querySelector('.definition .value')
  )?.textContent.trim() || ''

  return { word, hint }
}

function filterWords(words: string[]) {
  return words.filter(word => /^[a-z]{3,}$/.test(word))
}

async function fetchWords(level: string) {
  const vocabulary = await fetch(`http://www.wordcyclopedia.com/english/${level}`)
  const html = await vocabulary.text()
  const root = parse(html)

  return Array.from(root.querySelectorAll('.word')).map(word => word.textContent as string)
}

async function saveWords(level: string, words: Words[]) {
  const jsonFileContext = JSON.stringify(words, null, 2)

  await Bun.write(`${import.meta.dirname}/words/${level}.ts`, `export const ${level} = ${jsonFileContext}`)
}

const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as learnLevel[]
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

for (const level of levels) {
  const words = await fetchWords(level).then(filterWords)
  const detailedWordsInfo = [] as Words[]

  for (let index = 0; index < words.length; index++) {
    const word = words[index]

    try {
      const fetchedWord = await fetchWordInfo(word)
      detailedWordsInfo.push({
        ...fetchedWord,
        length: word.length,
        learnLevel: level,
      })
      console.log(`Fetched word info for [${level}] ${word} - ${index + 1}/${words.length}`)
    }
    catch (error) {
      console.error(error)
    }

    await sleep(100)
  }

  await saveWords(level, detailedWordsInfo)
}
