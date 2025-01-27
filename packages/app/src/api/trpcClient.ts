import type { TAppRouter } from 'types'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpcClient = createTRPCProxyClient<TAppRouter>({
  links: [
    httpBatchLink({
      url: 'http://wordle.localhost/api/',
    }),
  ],
})
