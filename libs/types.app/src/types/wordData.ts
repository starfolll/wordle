import type { Word } from 'prisma-client'
import type { TPrettify } from 'utility'

export type TGuessingWordData = TPrettify<Pick<Word, 'word' | 'length' | 'learnLevel'>>
