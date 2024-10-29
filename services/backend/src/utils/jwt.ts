import type { UserLoginData } from 'types.app'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

const JWT_COOKIE_NAME = 'authorization'
const JWT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const JWT_SECRET = Bun.env.JWT_SECRET!

export function jwtSign(payload: UserLoginData) {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_COOKIE_MAX_AGE,
    },
  )
}

export function jwtVerify(token: string) {
  return jwt.verify(token, JWT_SECRET) as UserLoginData
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
