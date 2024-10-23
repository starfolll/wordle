import type { AppRouter } from 'types.app'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://wordle.localhost/api/',
    }),
  ],
})
