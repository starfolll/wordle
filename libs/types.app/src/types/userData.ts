import type { User } from 'prisma-client'
import type { TPrettify } from 'utility'
import type { TAnyShopItemData } from './shop/shop-item'

export type TUserLoginData = TPrettify<Pick<
  User,
 'id' | 'token' | 'name'
>>

export type TUserInventoryData =
  TPrettify<Pick<User, 'coins' | 'diamonds'>> &
  {
    purchasedShopItems: TAnyShopItemData[]
  }
