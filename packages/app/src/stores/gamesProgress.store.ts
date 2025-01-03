import { trpcClient } from '@/api/trpcClient'
import { getWeek } from 'dates'
import { defineStore } from 'pinia'
import { type DailyChallengeGameProgressData, GameProgressType, type GamesProgressData, type TGameProgressData, type TGameProgressType } from 'types'
import { ref } from 'vue'

export const useGamesProgressStore = defineStore('gamesProgress', () => {
  const classicFourLetters = ref<GamesProgressData['classicFourLettersGameProgress'] | null>(null)
  const classicFiveLetters = ref<GamesProgressData['classicFiveLettersGameProgress'] | null>(null)
  const dailyChallenges = ref<Record<DailyChallengeGameProgressData['date'], DailyChallengeGameProgressData | null> | null>(null)
  const withHint = ref<GamesProgressData['withHintGameProgress'] | null>(null)

  const gameTypeToGameProgressRef = {
    [GameProgressType.classicFourLettersGameProgress]: classicFourLetters,
    [GameProgressType.classicFiveLettersGameProgress]: classicFiveLetters,
    dailyChallengesGameProgress: dailyChallenges,
    [GameProgressType.withHintGameProgress]: withHint,
  } as const

  const loadGameProgress = async () => {
    const gamesProgress = await trpcClient.getGamesProgress.query()

    classicFourLetters.value = gamesProgress.classicFourLettersGameProgress
    classicFiveLetters.value = gamesProgress.classicFiveLettersGameProgress
    withHint.value = gamesProgress.withHintGameProgress

    dailyChallenges.value = getWeek().reduce((acc, date) => {
      acc[date.toISOString()] = gamesProgress.dailyChallengesGameProgress[date.toISOString()] ?? null
      return acc
    }, {} as Record<string, DailyChallengeGameProgressData | null>)
  }

  const submitGuess = async (
    gameProgress: Extract<TGameProgressData, { gameType: TGameProgressType['classicFourLettersGameProgress']
      | TGameProgressType['classicFiveLettersGameProgress']
      | TGameProgressType['withHintGameProgress'] }>,
    guess: string,
  ) => {
    await trpcClient.submitGuess.mutate({ gameType: gameProgress.gameType, guess })

    gameProgress.guesses.push(guess)
  }

  const submitDailyChallengeGuess = async (dailyChallenge: DailyChallengeGameProgressData, guess: string) => {
    const { isCompleted, isWon } = await trpcClient.submitDailyChallengeGuess.mutate({ guess })

    dailyChallenge.guesses.push(guess)
    dailyChallenge.isCompleted = isCompleted
    dailyChallenge.isWon = isWon
  }

  const getDailyChallengeWord = async () => {
    return await trpcClient.getDailyChallengeWord.query()
  }

  const getNextWord = async (gameType: Parameters<typeof trpcClient.getNextWord.query>[0]['gameType']) => {
    const newGameProgress = await trpcClient.getNextWord.query({ gameType })
    gameTypeToGameProgressRef[gameType].value = newGameProgress
  }

  return {
    classicFourLetters,
    classicFiveLetters,
    dailyChallenges,
    withHint,

    gameTypeToGameProgressRef,

    loadGameProgress,

    submitGuess,
    submitDailyChallengeGuess,

    getDailyChallengeWord,
    getNextWord,
  }
})
