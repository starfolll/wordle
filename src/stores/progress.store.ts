import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

interface TClassicGameStore {
  word: string | null
  guesses: string[]
  streak: number
}

export const useProgressStore = defineStore('progress', () => {
  const classic4Letters = useLocalStorage<TClassicGameStore>('progressStore.classic4Letters', {
    word: null,
    guesses: [],
    streak: 0,
  })

  const classic5Letters = useLocalStorage<TClassicGameStore>('progressStore.classic5Letters', {
    word: null,
    guesses: [],
    streak: 0,
  })

  return {
    classic4Letters,
    classic5Letters,
  }
})
