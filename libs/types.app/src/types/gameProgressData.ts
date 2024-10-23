import type { GuessingWordData } from './wordData'
import type { WordHintData } from './wordHintData'

export interface GameProgressData {
  streak: number
  guesses: string[]

  word: GuessingWordData
  hint: WordHintData | null
}

export interface GameProgressWithHintData extends GameProgressData {
  hint: WordHintData
}
