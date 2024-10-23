import type { UserLoginData } from 'types.app'
import type { AppContext } from '../../appContext'
import { TRPCError } from '@trpc/server'
import cookie from 'cookie'
import { publicProcedure } from '../../trpc'
import { jwtVerify } from '../utils/jwt'

export function getAuthorizedUser(ctx: AppContext): UserLoginData | null {
  const unparsedCookies = ctx.req.headers.get('cookie')

  if (!unparsedCookies)
    return null

  const cookies = cookie.parse(unparsedCookies) as Record<string, string | undefined>
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
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
