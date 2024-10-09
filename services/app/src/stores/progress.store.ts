import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface GameProgress {
  word: string | null
  guesses: string[]
  streak: number
}

export const useProgressStore = defineStore('progress', () => {
  const classic4LettersWord = useLocalStorage<GameProgress['word']>('progressStore.classic4Letters.word', null)
  const classic4LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic4Letters.guesses', [])
  const classic4LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic4Letters.streak', 0)
  const classic4Letters = {
    word: classic4LettersWord,
    guesses: classic4LettersGuesses,
    streak: classic4LettersStreak,
  }

  const classic5LettersWord = useLocalStorage<GameProgress['word']>('progressStore.classic5Letters.word', null)
  const classic5LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic5Letters.guesses', [])
  const classic5LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic5Letters.streak', 0)
  const classic5Letters = {
    word: classic5LettersWord,
    guesses: classic5LettersGuesses,
    streak: classic5LettersStreak,
  }

  return {
    classic4Letters,
    classic5Letters,
  }
})
