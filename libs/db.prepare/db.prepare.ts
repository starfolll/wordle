import { type LearnLevel, PrismaClient, type Word } from '@prisma/client'

/* eslint-disable no-console */
import { a1 } from './words/a1'
import { a2 } from './words/a2'
import { b1 } from './words/b1'
import { b2 } from './words/b2'
import { c1 } from './words/c1'
import { c2 } from './words/c2'

const prisma = new PrismaClient()

const bannedWords = ['sex']
function isAppropriateWord(wordInfo: Word): boolean {
  return !bannedWords.some(bannedWord => wordInfo.word.includes(bannedWord))
}

function extendWordInfo(learnLevel: LearnLevel, words: Word[]): Word[] {
  return words.map(word => ({ ...word, learnLevel, length: word.word.length }))
}
const allWords = [
  extendWordInfo('a1', a1 as Word[]),
  extendWordInfo('a2', a2 as Word[]),
  extendWordInfo('b1', b1 as Word[]),
  extendWordInfo('b2', b2 as Word[]),
  extendWordInfo('c1', c1 as Word[]),
  extendWordInfo('c2', c2 as Word[]),
].flat().filter(isAppropriateWord)

console.log(`Inserting words into the database... ${allWords.length}`)
const logInsertion = (index: number) => console.log(`Inserted ${index.toString().padStart(allWords.length.toString().length, ' ')}/${allWords.length} words`);

(async () => {
  for (let index = 0; index < allWords.length; index++) {
    const { word, learnLevel } = allWords[index]

    if (index % 100 === 0)
      logInsertion(index)

    const wordInfo = {
      word,
      length: word.length,
      learnLevel,
    }

    await prisma.word.upsert({
      where: { word },
      update: wordInfo,
      create: {
        ...wordInfo,
        hints: {
          create: {
            hint: 'temp',
          },
        },
      },
    })
  }
}) ()
