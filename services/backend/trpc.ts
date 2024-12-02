import type { TAppContext } from './appContext'
import { initTRPC } from '@trpc/server'

const t = initTRPC
  .context<TAppContext>()
  .create()

export const router = t.router
export const publicProcedure = t.procedure

export type TAppOpts = typeof t._config['$types']
