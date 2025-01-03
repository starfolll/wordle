import type { Word } from 'prisma-client'
import { scrappersDB } from './db-data'

export function queryInsertWord(word: Word) {
  return scrappersDB.run(
    'INSERT INTO Words (word, length, learnLevel) VALUES (?, ?, ?)',
    [
      word.word,
      word.length,
      word.learnLevel,
    ],
  )
}
