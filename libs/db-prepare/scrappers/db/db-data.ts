import { Database } from 'bun:sqlite'

export const scrappersDB = new Database('./scrappers/data/scrapper-words.sqlite')
