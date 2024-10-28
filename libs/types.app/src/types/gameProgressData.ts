import type { GuessingWordData } from './wordData'
import type { WordHintData } from './wordHintData'

export const GameProgressType = {
  classicFourLettersGameProgress: 'classicFourLettersGameProgress',
  classicFiveLettersGameProgress: 'classicFiveLettersGameProgress',

  dailyChallengeGameProgress: 'dailyChallengeGameProgress',

  withHintGameProgress: 'withHintGameProgress',
} as const
export type TGameProgressType = typeof GameProgressType
export const GameProgressTypeValues = [
  GameProgressType.classicFourLettersGameProgress,
  GameProgressType.classicFiveLettersGameProgress,
  GameProgressType.dailyChallengeGameProgress,
  GameProgressType.withHintGameProgress,
] as const

export interface ClassicFourLettersGameProgressData {
  id: number
  gameType: TGameProgressType['classicFourLettersGameProgress']

  streak: number

  word: GuessingWordData
  hint: WordHintData | null

  guesses: string[]
  maxGuesses: number
}

export interface ClassicFiveLettersGameProgressData {
  id: number
  gameType: TGameProgressType['classicFiveLettersGameProgress']

  streak: number

  word: GuessingWordData
  hint: WordHintData | null

  guesses: string[]
  maxGuesses: number
}

export interface DailyChallengeGameProgressData {
  id: number
  gameType: TGameProgressType['dailyChallengeGameProgress']

  date: string

  word: GuessingWordData
  hint: WordHintData | null

  guesses: string[]
  maxGuesses: number
}

export interface WithHintGameProgressData {
  id: number
  gameType: TGameProgressType['withHintGameProgress']

  streak: number

  word: GuessingWordData
  hint: WordHintData

  guesses: string[]
  maxGuesses: number
}

export type GameProgressData =
  | ClassicFourLettersGameProgressData
  | ClassicFiveLettersGameProgressData
  | DailyChallengeGameProgressData
  | WithHintGameProgressData

export interface GamesProgressData {
  classicFourLettersGameProgress: ClassicFourLettersGameProgressData
  classicFiveLettersGameProgress: ClassicFiveLettersGameProgressData
  dailyChallengesGameProgress: DailyChallengeGameProgressData[]
  withHintGameProgress: WithHintGameProgressData
}

export interface SubmitGuessData {
  gameType: keyof TGameProgressType
  guess: string
}
