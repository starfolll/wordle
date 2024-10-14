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
db.run('CREATE TABLE IF NOT EXISTS words (word TEXT PRIMARY KEY, definition TEXT, learnLevel TEXT)')
db.run('CREATE INDEX IF NOT EXISTS words_word_index ON words (word)')
const isWordExistsQuery = db.prepare('SELECT * FROM words WHERE word = ?')
const insertQuery = db.prepare('INSERT INTO words (word, definition, learnLevel) VALUES (?, ?, ?)')

const bannedWords = ['sex']
function isAppropriateWord(wordInfo: TWordInfo): boolean {
  return !bannedWords.some(bannedWord => wordInfo.definition.includes(bannedWord) && wordInfo.word.includes(bannedWord))
}

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
].flat().filter(isAppropriateWord)

console.log(`Inserting words into the database... ${allWords.length}`)
const logInsertion = (index: number) => console.log(`Inserted ${index.toString().padStart(allWords.length.toString().length, ' ')}/${allWords.length} words`)
allWords.forEach(({ word, definition, learnLevel }, index) => {
  if (index % 100 === 0)
    logInsertion(index)

  if (!isWordExistsQuery.get(word))
    insertQuery.run(word, definition, learnLevel)
})
