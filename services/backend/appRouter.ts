import { getDailyChallengeWord } from './src/api/getDailyChallengeWord'
import { getGamesProgress } from './src/api/getGamesProgress'
import { getItemsInStore } from './src/api/getItemsInStore'
import { getNextWord } from './src/api/getNextWord'
import { getUserInventory } from './src/api/getUserInventory'
import { login } from './src/api/login'
import { purchaseStoreItem } from './src/api/purchaseStoreItem'
import { submitDailyChallengeGuess } from './src/api/submitDailyChallengeGuess'
import { submitGuess } from './src/api/submitGuess'
import { router } from './trpc'

export const appRouter = router({
  login,

  getItemsInStore,

  getGamesProgress,
  getNextWord,
  getDailyChallengeWord,
  getUserInventory,

  submitGuess,
  submitDailyChallengeGuess,

  purchaseStoreItem,
})
