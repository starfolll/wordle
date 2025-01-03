import type { TScrappedWordHint } from './types/scrraped-word-hint'
import { scrappersDB } from './db-data'

export function queryInsertHint(hint: TScrappedWordHint) {
  return scrappersDB.run(
    'INSERT INTO Hints (word, hint, length, hint, source) VALUES (?, ?, ?, ?, ?)',
    [
      hint.word,
      hint.hint,
      hint.length,
      hint.hint,
      hint.source,
    ],
  )
}
