import { defineStore } from 'pinia'
import { computed, ref, type UnwrapRef } from 'vue'

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
  const lettersInWord = ref(5)
  const maxGuesses = computed(() => lettersInWord.value + 1)

  const loading = ref(false)
  const word = ref<null | string>(null)

  const guesses = ref<string[]>([])
  const getClearWord = (length: number) => Array.from<null>({ length }).fill(null)
  const guessingWord = ref<Array<string | null>>([])
  const isGuessSubmittable = computed(() => !guessingWord.value.includes(null))
  const remainingGuesses = computed(() => maxGuesses.value - guesses.value.length)

  const isWon = computed(() => guesses.value.includes(word.value!))
  const isGameOver = computed(() => isWon.value || guesses.value.length >= maxGuesses.value)

  const addGuessingWordLetter = (letter: string) => {
    const index = guessingWord.value.indexOf(null)

    if (index !== -1)
      guessingWord.value[index] = letter
  }
  const removeLastGuessingWordLetter = () => {
    let index = -1

    for (let i = 0; i < guessingWord.value.length; i++) {
      if (guessingWord.value[i] !== null)
        index = i
    }

    if (index !== -1)
      guessingWord.value[index] = null
  }

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

  const clearGuessingWord = () => guessingWord.value = getClearWord(lettersInWord.value)
  const clearStore = () => {
    word.value = null
    clearGuessingWord()
    guesses.value = []
  }

  const submitGuess = (): boolean => {
    guesses.value.push(guessingWord.value.join(''))
    guessingWord.value = getClearWord(lettersInWord.value)

    return true
  }

  const setWord = (newWord: string) => {
    word.value = newWord
    lettersInWord.value = newWord.length
    guessingWord.value = getClearWord(lettersInWord.value)
  }

  const fetchNewWord = async () => {
    clearStore()

    loading.value = true

    const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${lettersInWord}`)
    const data = await response.json()

    setWord(data[0])
    loading.value = false
  }

  return {
    lettersInWord,
    maxGuesses,

    loading,
    word,
    guesses,
    guessingWord,
    isGuessSubmittable,
    remainingGuesses,

    isWon,
    isGameOver,

    getLetterTag,
    guessedLettersTag,

    addGuessingWordLetter,
    removeLastGuessingWordLetter,

    clearGuessingWord,
    clearStore,
    submitGuess,
    setWord,
    fetchNewWord,
  }
})
