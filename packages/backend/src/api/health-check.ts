import { publicProcedure } from '../../trpc'

export const healthCheck = publicProcedure
  .query(async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  })
