import type { TGameProgressType } from '../../../../libs/types'

export const defaultWordLength = {
  classicFourLettersGameProgress: 4,
  classicFiveLettersGameProgress: 5,
  dailyChallengeGameProgress: undefined,
  withHintGameProgress: undefined,
} satisfies {
  [_key in keyof TGameProgressType]: number | undefined
}

export function getDefaultMaxGuesses(gameType: keyof TGameProgressType, word: string) {
  return ({
    classicFourLettersGameProgress: word.length + 1,
    classicFiveLettersGameProgress: word.length + 1,
    dailyChallengeGameProgress: word.length + 1,
    withHintGameProgress: 3,
  } satisfies {
    [_key in keyof TGameProgressType]: number | undefined
  })[gameType]
}
