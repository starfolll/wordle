import type { GameProgress } from './progress.store'
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
  const gameProgressRef = ref<GameProgress | null>(null)

  const streak = computed<number>(() => gameProgressRef.value?.streak ?? 0)

  const word = computed<string | null>(() => gameProgressRef.value?.word ?? null)
  const lettersInWord = computed<number>(() => word.value?.length ?? 0)
  const maxGuesses = computed(() => lettersInWord.value + 1)

  const guesses = computed<string[]>(() => gameProgressRef.value?.guesses ?? [])
  const getClearGuess = (length: number) => Array.from<null>({ length }).fill(null)
  const currentGuess = ref<Array<string | null>>([])
  const clearGuessingWord = () => currentGuess.value = getClearGuess(lettersInWord.value)
  const isGuessSubmittable = computed<boolean>(() => !currentGuess.value.includes(null))
  const remainingGuesses = computed<number>(() => maxGuesses.value - guesses.value.length)

  const isWon = computed<boolean>(() => (word.value && guesses.value.includes(word.value)) || false)
  const isGameOver = computed<boolean>(() => isWon.value || guesses.value.length >= maxGuesses.value)

  const guessedLettersAppearAnimations = ['flip-x', 'flip-y']
  const getRandomAnimation = (animations: string[]) => animations[Math.floor(Math.random() * animations.length)]
  const guessedLettersAppearAnimation = ref<string>(getRandomAnimation(guessedLettersAppearAnimations))

  const addGuessingWordLetter = (letter: string) => {
    const index = currentGuess.value.indexOf(null)

    if (index !== -1)
      currentGuess.value[index] = letter
  }
  const removeLastGuessingWordLetter = () => {
    let index = -1

    for (let i = 0; i < currentGuess.value.length; i++) {
      if (currentGuess.value[i] !== null)
        index = i
    }

    if (index !== -1)
      currentGuess.value[index] = null
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

    guesses.value?.forEach(guess => guess.split('').forEach((letter, index) => {
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

  const onGameEnd = () => {
    if (gameProgressRef.value === null)
      return

    if (isWon)
      gameProgressRef.value.streak += 1
    else gameProgressRef.value.streak = 0
  }
  const submitGuess = (): boolean => {
    const guess = currentGuess.value.join('')

    guesses.value?.push(guess)
    isGameOver.value && onGameEnd()

    return true
  }

  const fetchNewWord = async (length: number) => {
    const response = await fetch(`http://localhost:3000/random-word?length=${length}`)
    return await response.text()
  }

  const setGameProgress = (newGameProgressRef: GameProgress | null) => {
    gameProgressRef.value = newGameProgressRef
    guessedLettersAppearAnimation.value = getRandomAnimation(guessedLettersAppearAnimations)
    clearGuessingWord()
  }

  const nextWord = async () => {
    if (gameProgressRef.value === null)
      return

    if (isWon.value) {
      gameProgressRef.value.word = await fetchNewWord(lettersInWord.value)
      gameProgressRef.value.guesses = []
    }
    else {
      gameProgressRef.value.word = await fetchNewWord(lettersInWord.value)
      gameProgressRef.value.streak = 0
      gameProgressRef.value.guesses = []
    }

    clearGuessingWord()
  }

  return {
    lettersInWord,

    streak,

    word,
    maxGuesses,
    guesses,
    currentGuess,
    isGuessSubmittable,
    remainingGuesses,

    isWon,
    isGameOver,

    guessedLettersAppearAnimation,

    getLetterTag,
    guessedLettersTag,

    addGuessingWordLetter,
    removeLastGuessingWordLetter,

    clearGuessingWord,
    submitGuess,
    fetchNewWord,
    setGameProgress,

    nextWord,
  }
})
