/* eslint-disable no-console */
import { cors } from '@elysiajs/cors'
import { Elysia, error, t } from 'elysia'
import { getRandomWordInfo } from './src/queries/getRandomWordInfo'

new Elysia()
  .use(cors({ origin: '*' }))
  .get('/random-word', async ({ query: { length } }) => {
    const randomWordInfo = await getRandomWordInfo(length)

    if (!randomWordInfo)
      return error(404, 'Word not found')

    console.log(`Sending word data: ${randomWordInfo.word}`)

    return {
      ...randomWordInfo,
      hint: randomWordInfo.hint.replaceAll(randomWordInfo.word, '...'),
    }
  }, {
    query: t.Object({
      length: t.Optional(t.Number({ minimum: 4, maximum: 5 })),
    }),
  })
  .listen(3000, server => console.log(`Server is running on ${server.url}`))
