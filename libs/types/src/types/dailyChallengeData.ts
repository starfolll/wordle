import type { TPrettify } from 'utility'
import type { TGuessingWordData } from './wordData'

export type TDailyChallengeData = TPrettify<{
  date: Date
  word: TGuessingWordData
}>
