import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type GameProgress, GameType, type TGameType, type TWordInfo } from './progress.store'
import { useStoreStore } from './store.store'

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
  const storeStore = useStoreStore()

  const gameProgressRef = ref<GameProgress | null>(null)

  const streak = computed<number>(() => gameProgressRef.value?.streak ?? 0)
  const gameType = computed<TGameType | null>(() => gameProgressRef.value?.gameType ?? null)

  const word = computed<TWordInfo['word'] | null>(() => gameProgressRef.value?.wordInfo?.word ?? null)
  const wordHint = computed<TWordInfo['hint'] | null>(() => gameProgressRef.value?.wordInfo?.hint ?? null)
  const wordLearnLevel = computed<TWordInfo['learnLevel'] | null>(() => gameProgressRef.value?.wordInfo?.learnLevel ?? null)

  const lettersInWord = computed<number>(() => word.value?.length ?? 0)
  const maxGuesses = computed(() => {
    if (gameType.value === GameType.withHint)
      return 3

    return lettersInWord.value + 1
  })

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

  const onGameEnd = () => {
    if (gameProgressRef.value === null)
      return

    if (isWon.value) {
      gameProgressRef.value.streak += 1
      storeStore.coins += 1
    }
    else {
      gameProgressRef.value.streak = 0
    }
  }
  const submitGuess = (): boolean => {
    const guess = currentGuess.value.join('')

    guesses.value?.push(guess)
    isGameOver.value && onGameEnd()

    return true
  }

  const fetchNewWord = async (length?: number): Promise<TWordInfo> => {
    const requestParams = length ? `?length=${length}` : ''
    const response = await fetch(`http://localhost:3000/random-word${requestParams}`)
    return await response.json()
  }

  const fetchDailyChallengeWord = async (): Promise<TWordInfo> => {
    const response = await fetch('http://localhost:3000/daily-challenge')
    return await response.json()
  }

  const setGameProgress = (newGameProgressRef: GameProgress | null) => {
    gameProgressRef.value = newGameProgressRef
    guessedLettersAppearAnimation.value = getRandomAnimation(guessedLettersAppearAnimations)
    clearGuessingWord()
  }

  const nextWord = async () => {
    if (gameProgressRef.value === null)
      return

    const lettersLimit = gameProgressRef.value.gameType === GameType.classic ? lettersInWord.value : undefined
    gameProgressRef.value.wordInfo = await fetchNewWord(lettersLimit)
    gameProgressRef.value.guesses = []

    clearGuessingWord()
  }

  return {
    lettersInWord,

    streak,
    gameType,

    word,
    wordHint,
    wordLearnLevel,

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
    guessedLettersCount,

    addGuessingWordLetter,
    removeLastGuessingWordLetter,

    clearGuessingWord,
    submitGuess,
    setGameProgress,

    fetchDailyChallengeWord,
    fetchNewWord,
    nextWord,
  }
})
