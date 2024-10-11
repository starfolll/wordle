/* eslint-disable no-console */
import type { TLearnLevel, TWordInfo } from './parser'
import { Database } from 'bun:sqlite'

import { a1 } from './words/a1'
import { a2 } from './words/a2'
import { b1 } from './words/b1'
import { b2 } from './words/b2'
import { c1 } from './words/c1'
import { c2 } from './words/c2'

export type TExtendedWordInfo = TWordInfo & { learnLevel: TLearnLevel }

const db = new Database('./words/words.sqlite')
db.prepare('CREATE TABLE IF NOT EXISTS words (word TEXT PRIMARY KEY, definition TEXT, learnLevel TEXT)').run()
db.prepare('CREATE INDEX IF NOT EXISTS words_word_index ON words (word)').run()

function extendWordInfo(learnLevel: TLearnLevel, words: TWordInfo[]): TExtendedWordInfo[] {
  return words.map(word => ({ ...word, learnLevel }))
}
const allWords = [
  extendWordInfo('a1', a1),
  extendWordInfo('a2', a2),
  extendWordInfo('b1', b1),
  extendWordInfo('b2', b2),
  extendWordInfo('c1', c1),
  extendWordInfo('c2', c2),
].flat()

const insertQuery = db.prepare('INSERT INTO words (word, definition, learnLevel) VALUES (?, ?, ?)')

console.log(`Inserting words into the database... ${allWords.length}`)
allWords.forEach(({ word, definition, learnLevel }, index) => {
  if (index % 100 === 0)
    console.log(`Inserted ${index}/${allWords.length} words`)

  insertQuery.run(word, definition, learnLevel)
})
