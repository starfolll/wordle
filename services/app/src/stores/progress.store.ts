import type { UnwrapRef } from 'vue'
import { type Serializer, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface TWordInfo {
  word: string
  hint: string
  learnLevel: 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2'
}

export const GameType = {
  classic: 'classic',
  withHint: 'withHint',
} as const
export type TGameType = keyof typeof GameType

export type GameProgress = {
  wordInfo: TWordInfo | null
  guesses: string[]
  streak: number
} & ({
  gameType: typeof GameType['classic']
  wordLength: 4 | 5
} | {
  gameType: typeof GameType['withHint']
})

const serializer: Serializer<TWordInfo | null> = {
  read: value => JSON.parse(value),
  write: value => JSON.stringify(value),
}

export const useProgressStore = defineStore('progress', () => {
  const classic4LettersWord = useLocalStorage<GameProgress['wordInfo']>('progressStore.classic4Letters.wordInfo', null, { serializer })
  const classic4LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic4Letters.guesses', [])
  const classic4LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic4Letters.streak', 0)
  const classic4Letters = {
    wordInfo: classic4LettersWord as unknown as UnwrapRef<typeof classic4LettersWord>,
    guesses: classic4LettersGuesses as unknown as UnwrapRef<typeof classic4LettersGuesses>,
    streak: classic4LettersStreak as unknown as UnwrapRef<typeof classic4LettersStreak>,
    gameType: GameType.classic,
    wordLength: 4,
  } satisfies GameProgress

  const classic5LettersWord = useLocalStorage<GameProgress['wordInfo']>('progressStore.classic5Letters.wordInfo', null, { serializer })
  const classic5LettersGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.classic5Letters.guesses', [])
  const classic5LettersStreak = useLocalStorage<GameProgress['streak']>('progressStore.classic5Letters.streak', 0)
  const classic5Letters = {
    wordInfo: classic5LettersWord as unknown as UnwrapRef<typeof classic5LettersWord>,
    guesses: classic5LettersGuesses as unknown as UnwrapRef<typeof classic5LettersGuesses>,
    streak: classic5LettersStreak as unknown as UnwrapRef<typeof classic5LettersStreak>,
    gameType: GameType.classic,
    wordLength: 5,
  } satisfies GameProgress

  const withHintsWord = useLocalStorage<GameProgress['wordInfo']>('progressStore.withHints.wordInfo', null, { serializer })
  const withHintsGuesses = useLocalStorage<GameProgress['guesses']>('progressStore.withHints.guesses', [])
  const withHintsStreak = useLocalStorage<GameProgress['streak']>('progressStore.withHints.streak', 0)
  const withHints = {
    wordInfo: withHintsWord,
    guesses: withHintsGuesses,
    streak: withHintsStreak,
    gameType: GameType.withHint,
  } satisfies Record<keyof GameProgress, any>

  return {
    classic4Letters,
    classic5Letters,
    withHints,
  }
})
