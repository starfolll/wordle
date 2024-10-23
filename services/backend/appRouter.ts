import { getDailyChallenge } from './src/api/getDailyChallenge'
import { login } from './src/api/login'
import { submit4LetterGuess } from './src/api/submit4LettersGuess'
import { router } from './trpc'

export const appRouter = router({
  getDailyChallengeProcedure: getDailyChallenge,

  login,

  submit4LetterGuess,
})
