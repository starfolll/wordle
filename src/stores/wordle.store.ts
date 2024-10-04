import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export enum TMatchingLetterTag {
  EXACT = 'exact',
  PARTIAL = 'partial',
  NONE = 'none',
}

export const letterClassName = {
  exact: 'bg-lime-400 text-lime-900',
  partial: 'bg-yellow-400 text-yellow-900',
  none: '',
} satisfies Record<TMatchingLetterTag, string>

export const useWordleStore = defineStore('wordle', () => {
  const lettersInWord = 5
  const maxGuesses = lettersInWord + 1

  const loading = ref(false)
  const word = ref<null | string>(null)
  const guesses = ref<string[]>([])
  const getClearWord = () => Array.from<null>({ length: lettersInWord }).fill(null)
  const guessingWord = ref<Array<string | null>>(getClearWord())
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

  const guessedLettersTag = computed<Record<string, TMatchingLetterTag>>(() => {
    const guessedLetters: Record<string, TMatchingLetterTag> = {}

    guesses.value.forEach(guess => guess.split('').forEach((letter, index) => {
      if (guessedLetters[letter] === TMatchingLetterTag.EXACT)
        return

      const tag = getLetterTag(letter, index)

      if (
        !guessedLetters[letter]
        || tag === TMatchingLetterTag.EXACT
        || (tag === TMatchingLetterTag.PARTIAL && guessedLetters[letter] === TMatchingLetterTag.NONE)
      ) {
        guessedLetters[letter] = tag
      }
    }))

    return guessedLetters
  })

  const submitGuess = (guess: string): boolean => {
    guesses.value.push(guess)

    return true
  }

  const clearGuessingWord = () => guessingWord.value = getClearWord()

  const clearStore = () => {
    word.value = null
    clearGuessingWord()
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
    guessingWord,
    remainingGuesses,

    isWon,
    isGameOver,

    getLetterTag,
    guessedLettersTag,

    submitGuess,
    clearGuessingWord,
    fetchNewWord,
  }
})
