import type { Word } from 'prisma-client'
import type { TPrettify } from 'types.utility'

export type TGuessingWordData = TPrettify<Pick<Word, 'word' | 'length' | 'learnLevel'>>
