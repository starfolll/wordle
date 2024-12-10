import type { TUserLoginData } from 'types.app'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

const JWT_COOKIE_NAME = 'authorization'
const JWT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const BACKEND_JWT_SECRET = Bun.env.BACKEND_JWT_SECRET!

export function jwtSign(payload: TUserLoginData) {
  return jwt.sign(
    payload,
    BACKEND_JWT_SECRET,
    {
      expiresIn: JWT_COOKIE_MAX_AGE,
    },
  )
}

export function jwtVerify(token: string) {
  return jwt.verify(token, BACKEND_JWT_SECRET) as TUserLoginData
}

export function getJwtCookie(userJWT: string) {
  return cookie.serialize(
    JWT_COOKIE_NAME,
    userJWT,
    {
      maxAge: JWT_COOKIE_MAX_AGE,
    },
  )
}
