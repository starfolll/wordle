import type { WordHint } from 'prisma-client'
import type { TPrettify } from 'utility'

export type TWordHintData = TPrettify<Pick<WordHint, 'hint'>>
