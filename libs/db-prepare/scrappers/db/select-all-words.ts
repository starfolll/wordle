import type { Word } from 'prisma-client'
import { scrappersDB } from './db-data'

export function querySelectAllWords() {
  return scrappersDB.query<Word, []>('SELECT * FROM Words')
}
