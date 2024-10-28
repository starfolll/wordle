import type { User } from 'prisma-client'
import type { Prettify } from 'types.utility'

export type UserLoginData = Prettify<Pick<User, 'id' | 'token' | 'name'>>
