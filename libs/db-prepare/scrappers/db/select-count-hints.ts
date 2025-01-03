import { scrappersDB } from './db-data'

const query = scrappersDB.query<{ count: number }, []>('SELECT COUNT(*) as count FROM Hints')

export function querySelectCountHints() {
  return query.get()?.count ?? 0
}
