import type { User } from 'prisma-client'
import type { Prettify } from 'types.utility'
import type { GameProgressData, GameProgressWithHintData } from './gameProgressData'

export type UserLoginData = Prettify<Pick<User, 'id' | 'name'>>

export type PrivateUserData = Prettify<
  UserLoginData
  & {
    classicFourLettersGameProgress: GameProgressData
    classicFiveLettersGameProgress: GameProgressData
    withHintGameProgress: GameProgressWithHintData
  }
>
