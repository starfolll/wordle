import type { TExtendedWordInfo } from './db.prepare'
/* eslint-disable no-console */
import { cors } from '@elysiajs/cors'
import { Database } from 'bun:sqlite'
import { Elysia, error, t } from 'elysia'

const db = new Database('./words/words.sqlite')

const randomWordQuery = db.prepare<TExtendedWordInfo, []>('SELECT * FROM words ORDER BY RANDOM() LIMIT 1')
const randomWordQueryWithLengthLimit = db.prepare<TExtendedWordInfo, [number]>('SELECT * FROM words WHERE LENGTH(word) = ? ORDER BY RANDOM() LIMIT 1')
const wordHintQuery = db.prepare<TExtendedWordInfo, [string]>('SELECT * FROM words WHERE word = ?')

new Elysia()
  .use(cors({ origin: '*' }))
  .get('/random-word', ({ query: { length } }) => {
    const data = length
      ? randomWordQueryWithLengthLimit.get(length)
      : randomWordQuery.get()

    if (!data)
      throw new Error('No word found')

    console.log(`Sending word data: ${data.word}`)
    return data
  }, {
    query: t.Object({
      length: t.Optional(t.Number({ minimum: 4, maximum: 5 })),
    }),
  })
  .get('/word-hint/:word', ({ params: { word } }) => {
    if (/^[a-z]$/.test(word))
      return error(404, 'Invalid word')

    const data = wordHintQuery.get(word)
    if (!data)
      return error(404, 'Word not found')

    console.log(`Sending word hint: ${data.word}`)
    return data.definition.replace(word, '...')
  }, {
    params: t.Object({
      word: t.String(),
    }),
  })
  .listen(3000, server => console.log(`Server is running on ${server.url}`))
