import { scrappersDB } from './db-data'

export function queryCreateTables() {
  scrappersDB.run('CREATE TABLE IF NOT EXISTS Words (word TEXT PRIMARY KEY, length INTEGER, learnLevel TEXT)')
  scrappersDB.run('CREATE TABLE IF NOT EXISTS Hints (word TEXT, hint TEXT, length INTEGER, hash TEXT UNIQUE, source TEXT, unique (word, hint))')
}
