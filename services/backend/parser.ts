/* eslint-disable no-console */
import { parse } from 'node-html-parser'

const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

async function fetchWords(level: string) {
  console.log(`Fetching words for level ${level}...`)
  const vocabulary = await fetch(`http://www.wordcyclopedia.com/english/${level}`)
  const html = await vocabulary.text()
  const root = parse(html)

  console.log(`Parsing words for level ${level}...`)
  return Array.from(root.querySelectorAll('.word')).map(word => word.textContent as string)
}

const minWordLength = 3
function filterWords(words: string[]) {
  return words.filter(word => word.length >= minWordLength && !word.includes(' '))
}

async function saveWords(level: string, words: string[]) {
  const filteredWords = filterWords(words)
  const jsonFileContext = JSON.stringify(filteredWords, null, 2)

  console.log(`Saving words (${filteredWords.length}) for level ${level}...`)
  await Bun.write(`${import.meta.dirname}/words/${level}.ts`, `export const ${level} = ${jsonFileContext}`)
}

Promise.all(levels.map(level => fetchWords(level).then(words => saveWords(level, words))))
