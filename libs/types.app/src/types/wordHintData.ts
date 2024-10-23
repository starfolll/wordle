import type { WordHint } from 'prisma-client'
import type { Prettify } from 'types.utility'

export type WordHintData = Prettify<Pick<WordHint, 'hint'>>
