import type { User } from 'prisma-client'
import type { TPrettify } from 'types.utility'
import type { TAnyShopItemData } from './shopItemData'

export type TUserLoginData = TPrettify<Pick<
  User,
 'id' | 'token' | 'name'
>>

export type TUserInventoryData =
  TPrettify<Pick<User, 'coins' | 'diamonds'>> &
  {
    purchasedShopItems: TAnyShopItemData[]
  }
