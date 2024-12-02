import { TMatchingLetterTag } from '@/helpers/class-names/matching-letter'
import { decryptWord } from 'encryption'
import { defineStore } from 'pinia'
import { type TGameProgressData, GameProgressType, type TGameProgressType, type TWordHintData } from 'types.app'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'

export const useWordleStore = defineStore('wordle', () => {
  const userStore = useUserStore()

  const gameProgressRef = ref<TGameProgressData | null>(null)

  const gameType = computed<keyof TGameProgressType | null>(() => gameProgressRef.value?.gameType ?? null)

  const streak = computed<number | null>(() => {
    if (gameProgressRef.value?.gameType !== GameProgressType.dailyChallengeGameProgress)
      return gameProgressRef.value?.streak ?? null

    return null
  })

  const word = computed<TGameProgressData['word']['word'] | null>(() => {
    if (!gameProgressRef.value?.word.word || !userStore.userData?.token)
      return null

    return decryptWord(gameProgressRef.value.word.word, userStore.userData.token)
  })
  const wordLength = computed<TGameProgressData['word']['length']>(() => gameProgressRef.value?.word.length ?? 0)
  const wordLearnLevel = computed<TGameProgressData['word']['learnLevel'] | null>(() => gameProgressRef.value?.word.learnLevel ?? null)

  const wordHint = computed<TWordHintData['hint'] | null>(() => gameProgressRef.value?.hint?.hint ?? null)

  const maxGuesses = computed<TGameProgressData['maxGuesses']>(() => gameProgressRef.value?.maxGuesses ?? 0)

  const guesses = computed<string[]>(() => gameProgressRef.value?.guesses ?? [])
  const getClearGuess = (length: number) => Array.from<null>({ length }).fill(null)
  const currentGuess = ref<Array<string | null>>([])
  const clearGuessingWord = () => currentGuess.value = getClearGuess(wordLength.value)
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

  // todo: refactor this. (move letters metadata to a separate record)
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
  const guessedLettersCount = computed<Record<string, number>>(() => {
    if (word.value === null)
      return {}

    return Object.keys(guessedLettersTag.value).reduce((acc, letter) => {
      acc[letter] = word.value!.split(letter).length - 1
      return acc
    }, {} as Record<string, number>)
  })

  const setGameProgress = (newGameProgressRef: TGameProgressData | null) => {
    gameProgressRef.value = newGameProgressRef
    guessedLettersAppearAnimation.value = getRandomAnimation(guessedLettersAppearAnimations)
    clearGuessingWord()
  }

  return {
    gameProgress: gameProgressRef,

    gameType,

    streak,

    word,
    wordLength,
    wordHint,
    wordLearnLevel,

    maxGuesses,
    guesses,
    currentGuess,
    isGuessSubmittable,
    remainingGuesses,

    addGuessingWordLetter,
    removeLastGuessingWordLetter,
    clearGuessingWord,

    isWon,
    isGameOver,

    guessedLettersAppearAnimation,

    getLetterTag,
    guessedLettersTag,
    guessedLettersCount,

    setGameProgress,
  }
})
