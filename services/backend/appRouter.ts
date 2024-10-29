import { getDailyChallengeWord } from './src/api/getDailyChallengeWord'
import { getGamesProgress } from './src/api/getGamesProgress'
import { getNextWord } from './src/api/getNextWord'
import { login } from './src/api/login'
import { submitDailyChallengeGuess } from './src/api/submitDailyChallengeGuess'
import { submitGuess } from './src/api/submitGuess'
import { router } from './trpc'

export const appRouter = router({
  login,

  getGamesProgress,
  getNextWord,
  getDailyChallengeWord,

  submitGuess,
  submitDailyChallengeGuess,
})
