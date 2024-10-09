/* eslint-disable no-console */
import { cors } from '@elysiajs/cors'
import { Elysia, t } from 'elysia'

import { a1 } from './words/a1'
import { a2 } from './words/a2'
import { b1 } from './words/b1'
import { b2 } from './words/b2'
import { c1 } from './words/c1'
import { c2 } from './words/c2'

const allWords = [a1, a2, b1, b2, c1, c2].flat()
const levels = { a1, a2, b1, b2, c1, c2 } as Record<string, string[]>

new Elysia()
  .use(cors({ origin: '*' }))
  .get('/random-word', ({ query: { level, length } }) => {
    if (level && !levels[level])
      return 'Invalid level'

    const words = level ? levels[level] : allWords
    const filteredWords = length ? words.filter(word => word.length === length) : words

    return filteredWords[Math.floor(Math.random() * filteredWords.length)]
  }, {
    query: t.Object({
      level: t.Optional(t.String()),
      length: t.Optional(t.Number({ minimum: 4, maximum: 5 })),
    }),
  })
  .listen(3000, server => console.log(`Server is running on ${server.url}`))
