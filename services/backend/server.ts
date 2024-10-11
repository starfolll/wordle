import type { TExtendedWordInfo } from './db.prepare'
/* eslint-disable no-console */
import { cors } from '@elysiajs/cors'
import { Database } from 'bun:sqlite'
import { Elysia, t } from 'elysia'

const db = new Database('./words/words.sqlite')

const randomWordQuery = db.prepare<TExtendedWordInfo, []>('SELECT word FROM words ORDER BY RANDOM() LIMIT 1')
const randomWordQueryWithLengthLimit = db.prepare<TExtendedWordInfo, [number]>('SELECT word FROM words WHERE LENGTH(word) = ? ORDER BY RANDOM() LIMIT 1')

new Elysia()
  .use(cors({ origin: '*' }))
  .get('/random-word', ({ query: { length } }) => {
    const data = length
      ? randomWordQueryWithLengthLimit.get(length)
      : randomWordQuery.get()

    if (!data)
      throw new Error('No word found')

    const { word } = data

    console.log(`Sending word: ${word}`)
    return word
  }, {
    query: t.Object({
      length: t.Optional(t.Number({ minimum: 4, maximum: 5 })),
    }),
  })
  .listen(3000, server => console.log(`Server is running on ${server.url}`))
