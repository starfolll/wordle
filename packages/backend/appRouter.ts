import { getDailyChallengeWord } from './src/api/getDailyChallengeWord'
import { getGamesProgress } from './src/api/getGamesProgress'
import { getItemsInShop } from './src/api/getItemsInStore'
import { getNextWord } from './src/api/getNextWord'
import { getUserInventory } from './src/api/getUserInventory'
import { healthCheck } from './src/api/health-check'
import { login } from './src/api/login'
import { purchaseStoreItem } from './src/api/storeItems/purchaseStoreItem'
import { submitDailyChallengeGuess } from './src/api/submitDailyChallengeGuess'
import { submitGuess } from './src/api/submitGuess'
import { router } from './trpc'

export const appRouter = router({
  healthCheck,

  login,

  getItemsInShop,

  getGamesProgress,
  getNextWord,
  getDailyChallengeWord,
  getUserInventory,

  submitGuess,
  submitDailyChallengeGuess,

  purchaseStoreItem,
})
