import type { TUserLoginData } from '../../../../libs/types'
import { publicProcedure } from '../../trpc'
import { getAuthorizedUser } from '../procedures/authorized.prcdr'
import { createUserData } from '../utils/createUserData'
import { getJwtCookie, jwtSign } from '../utils/jwt'

export const login = publicProcedure
  .query(async (opts): Promise<TUserLoginData> => {
    const authorizedUser = getAuthorizedUser(opts.ctx)

    if (authorizedUser)
      return authorizedUser

    const userData = await createUserData()
    const userJWT = jwtSign(userData)

    opts.ctx.resHeaders.set('Set-Cookie', getJwtCookie(userJWT))

    return userData
  })
