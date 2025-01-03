import type { TScrappedWordHint } from './types/scrraped-word-hint'
import { scrappersDB } from './db-data'

const selectedHint = scrappersDB.prepare(
  'SELECT * FROM Hints WHERE word = ? AND hint = ?',
)

export function querySelectIsHintExists(hint: TScrappedWordHint): boolean {
  const selectedHintResult = selectedHint.get(hint.word, hint.hint)

  return !!selectedHintResult
}
