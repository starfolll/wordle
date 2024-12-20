import { dbPopulateShopItems } from './db-populate/db-populate-shop-items'
import { dbPopulateWords } from './db-populate/db-populate-words'

(async () => {
  await dbPopulateShopItems()
  await dbPopulateWords()
})()
