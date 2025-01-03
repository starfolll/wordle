import type { TUserLoginData } from '../../../../libs/types'
import type { TAppContext } from '../../appContext'
import { TRPCError } from '@trpc/server'
import cookie from 'cookie'
import { publicProcedure } from '../../trpc'
import { jwtVerify } from '../utils/jwt'

export function getAuthorizedUser(ctx: TAppContext): TUserLoginData | null {
  const unparsedCookies = ctx.req.headers.get('cookie')

  if (!unparsedCookies)
    return null

  const cookies = cookie.parse(unparsedCookies) as Record<string, string | undefined>
  const authCookie = cookies.authorization

  if (!authCookie)
    return null

  try {
    return jwtVerify(authCookie)
  }
  catch {
    return null
  }
}

export const authorizedProcedure = publicProcedure.use(async (opts) => {
  const user = getAuthorizedUser(opts.ctx)

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    })
  }

  return opts.next({
    ctx: {
      user,
    },
  })
})
