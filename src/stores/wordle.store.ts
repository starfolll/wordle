import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export enum TMatchingLetterTag {
  EXACT = 'exact',
  PARTIAL = 'partial',
  NONE = 'none',
}

export const useWordleStore = defineStore('wordle', () => {
  const lettersInWord = 5
  const maxGuesses = lettersInWord + 1

  const loading = ref(false)
  const word = ref<null | string>(null)
  const guesses = ref<string[]>([])
  const remainingGuesses = computed(() => maxGuesses - guesses.value.length)

  const isWon = computed(() => guesses.value.includes(word.value!))
  const isGameOver = computed(() => isWon.value || guesses.value.length >= maxGuesses)

  const getLetterTag = (letter: string, index: number): TMatchingLetterTag => {
    if (word.value?.charAt(index) === letter)
      return TMatchingLetterTag.EXACT

    if (word.value?.includes(letter))
      return TMatchingLetterTag.PARTIAL

    return TMatchingLetterTag.NONE
  }

  const submitGuess = (guess: string): boolean => {
    guesses.value.push(guess)

    return true
  }

  const clearStore = () => {
    word.value = null
    guesses.value = []
  }

  const fetchNewWord = async () => {
    clearStore()

    loading.value = true

    const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${lettersInWord}`)
    const data = await response.json()

    word.value = data[0]
    loading.value = false
  }

  return {
    lettersInWord,
    maxGuesses,

    loading,
    word,
    guesses,
    remainingGuesses,

    isWon,
    isGameOver,

    getLetterTag,
    submitGuess,
    fetchNewWord,
  }
})
