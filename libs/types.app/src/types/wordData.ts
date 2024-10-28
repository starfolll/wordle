import type { Word } from 'prisma-client'
import type { Prettify } from 'types.utility'

export type GuessingWordData = Prettify<Pick<Word, 'word' | 'length' | 'learnLevel'>>
