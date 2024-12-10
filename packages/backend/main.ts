import { createBunHttpHandler } from 'trpc-bun-adapter'
import { createContext } from './appContext'
import { appRouter } from './appRouter'

const BACKEND_HOST = Bun.env.BACKEND_HOST!
const BACKEND_PORT = Bun.env.BACKEND_PORT!

const bunHandler = createBunHttpHandler({
  endpoint: '/api',

  router: appRouter,

  createContext,

  onError({ error }) {
    console.error(error)
  },
})

const server = Bun.serve({
  hostname: BACKEND_HOST,
  port: BACKEND_PORT,

  fetch(request, response) {
    return bunHandler(request, response) ?? new Response('Not found', { status: 404 })
  },
})

// eslint-disable-next-line no-console
console.log(`🚀 Server ready at ${server.url}`)
