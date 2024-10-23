import type { AppContext } from './appContext'
import { initTRPC } from '@trpc/server'

const t = initTRPC
  .context<AppContext>()
  .create()

export const router = t.router
export const publicProcedure = t.procedure

export type AppOpts = typeof t._config['$types']
