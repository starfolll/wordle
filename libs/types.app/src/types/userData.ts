import type { User } from 'prisma-client'
import type { Prettify } from 'types.utility'
import type { AnyStoreItemData } from './storeItemData'

export type UserLoginData = Prettify<Pick<
  User,
 'id' | 'token' | 'name'
>>

export type UserInventoryData =
  Prettify<Pick<User, 'coins' | 'diamonds'>> &
  {
    purchasedStoreItems: AnyStoreItemData[]
  }
