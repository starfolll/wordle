/* eslint-disable no-console */

import type { HTMLElement } from 'node-html-parser'
import type { TScrappedWordHint } from './db/types/scrraped-word-hint'
import { } from 'node:zlib'
import { parse } from 'node-html-parser'
import { sleep } from 'utility'
import { queryInsertHint } from './db/insert-hint'
import { querySelectAllWords } from './db/select-all-words'
import { querySelectCountWord } from './db/select-count-word'
import { querySelectIsHintExists } from './db/select-is-hint-exists'

const hintsUrl = new URL('https://crosswords.io/answer/')

function hashHint(word: string, hint: string) {
  return new Bun.CryptoHasher('sha256')
    .update(word)
    .update(hint)
    .digest('hex')
}

function getHintDataFromRow(word: string, row: HTMLElement): TScrappedWordHint | null {
  const hint = row.querySelector('td:nth-child(1)')?.textContent.trim()
  const source = row.querySelector('td:nth-child(2)')?.textContent.trim() || ''

  if (!hint)
    return null

  return {
    word,
    hint,
    length: hint.length,
    hash: hashHint(word, hint),
    source: source === '' ? null : source,
  }
}

async function fetchWordHints(word: string): Promise<TScrappedWordHint[]> {
  const url = new URL(word, hintsUrl)
  const response = await fetch(url.toString())
  const responseText = await response.text()

  const htmlRoot = parse(responseText)

  const hintsRows = htmlRoot.querySelectorAll('.table.table-striped tbody tr')
  const hints: TScrappedWordHint[] = []

  for (const row of hintsRows) {
    const hintData = getHintDataFromRow(word, row)

    if (hintData)
      hints.push(hintData)
  }

  return hints
}

async function scrapeHints() {
  console.log('Scraping hints...')

  const wordsCount = querySelectCountWord()
  const wordsQuery = querySelectAllWords()

  let i = 0
  for (const word of wordsQuery.iterate()) {
    const hints = await fetchWordHints(word.word)

    if (hints.length === 0) {
      console.log(`No hints found for ${word.word}`)
      continue
    }

    for (const hint of hints) {
      if (!querySelectIsHintExists(hint))
        queryInsertHint(hint)
    }

    const progress = ((i / wordsCount) * 100).toFixed(2)
    console.log(`Hint: ${word.word.padEnd(20)} | hints count: ${hints.length.toString().padEnd(5)} | progress: ${progress}%`)
    sleep(180)

    i++
  }
}

scrapeHints()
