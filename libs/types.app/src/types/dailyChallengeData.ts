import type { Prettify } from 'types.utility'
import type { GuessingWordData } from './wordData'

export type DailyChallengeData = Prettify<{
  date: Date
  word: GuessingWordData
}>
