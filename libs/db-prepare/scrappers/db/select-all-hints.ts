import type { TScrappedWordHint } from './types/scrraped-word-hint'
import { scrappersDB } from './db-data'

export function querySelectAllHints() {
  return scrappersDB.query<TScrappedWordHint, []>('SELECT * FROM Hints')
}
