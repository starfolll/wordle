import { type Serializer, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface TWordInfo {
  word: string
  definition: string
  learnLevel: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'
}

export interface GameProgress {
  wordInfo: TWordInfo | null
  guesses: string[]
  streak: number
}

const jsonSerializer: Serializer<TWordInfo | null> = {
  read: value => JSON.parse(value),
  write: value => JSON.stringify(value),
}

export const useProgressStore = defineStore('progress', () => {
  const classic4LettersWord = useLocalStorage<GameProgress['wordInfo']>('progressStore.classic4Letters.wordInfo', null, {
    serializer: jsonSerializer,
  })
  const classic4LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic4Letters.guesses', [])
  const classic4LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic4Letters.streak', 0)
  const classic4Letters = {
    wordInfo: classic4LettersWord,
    guesses: classic4LettersGuesses,
    streak: classic4LettersStreak,
  } satisfies Record<keyof GameProgress, any>

  const classic5LettersWord = useLocalStorage<GameProgress['wordInfo']>('progressStore.classic5Letters.wordInfo', null)
  const classic5LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic5Letters.guesses', [])
  const classic5LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic5Letters.streak', 0)
  const classic5Letters = {
    wordInfo: classic5LettersWord,
    guesses: classic5LettersGuesses,
    streak: classic5LettersStreak,
  } satisfies Record<keyof GameProgress, any>

  return {
    classic4Letters,
    classic5Letters,
  }
})
