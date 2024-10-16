/* eslint-disable antfu/no-top-level-await */
/* eslint-disable no-console */
import { parse } from 'node-html-parser'

export type TLearnLevel = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'

export interface TWordInfo {
  word: string
  hint: string
}

async function fetchWordInfo(word: string): Promise<TWordInfo> {
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

async function saveWords(level: string, words: TWordInfo[]) {
  const jsonFileContext = JSON.stringify(words, null, 2)

  await Bun.write(`${import.meta.dirname}/words/${level}.ts`, `export const ${level} = ${jsonFileContext}`)
}

const levels = ['b1', 'b2', 'c1', 'c2'] as TLearnLevel[]
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

for (const level of levels) {
  const words = await fetchWords(level).then(filterWords)
  const detailedWordsInfo = [] as TWordInfo[]

  for (let index = 0; index < words.length; index++) {
    const word = words[index]

    try {
      detailedWordsInfo.push(await fetchWordInfo(word))
      console.log(`Fetched word info for [${level}] ${word} - ${index + 1}/${words.length}`)
    }
    catch (error) {
      console.error(error)
    }

    await sleep(300)
  }

  await saveWords(level, detailedWordsInfo)
}
