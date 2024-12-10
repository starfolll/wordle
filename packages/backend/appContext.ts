import type { CreateBunContextOptions } from 'trpc-bun-adapter'

export function createContext(opts: CreateBunContextOptions) {
  return opts
}

export type TAppContext = ReturnType<typeof createContext>
