import type { WordHint } from 'prisma-client'

export type TScrappedWordHint = {
  word: string
} & Pick<WordHint, 'hint' | 'length' | 'hash' | 'source'>
