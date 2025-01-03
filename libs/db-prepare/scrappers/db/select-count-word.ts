import { scrappersDB } from './db-data'

const query = scrappersDB.query<{ count: number }, []>('SELECT COUNT(*) as count FROM Words')

export function querySelectCountWord() {
  return query.get()?.count ?? 0
}
