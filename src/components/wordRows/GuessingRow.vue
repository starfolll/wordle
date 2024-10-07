<script setup lang="ts">
import { vBounce } from '@/directives/animations/v-bounce'
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import LetterCell from './LetterCell.vue'
import WordContainer from './WordContainer.vue'

const wordleStore = useWordleStore()

const inputs = ref<HTMLInputElement[]>([])
const LetterCells = ref<typeof LetterCell[]>([])

const isAllowedLetter = (char: string) => /[a-z]/i.test(char)
const focusInput = (index: number) => requestAnimationFrame(() => inputs.value[index]?.focus())

function setGuessingWordLetter(letter: string | null, index: number) {
  wordleStore.currentGuess[index] = letter?.toLocaleLowerCase() ?? letter
}

function onInput(e: Event, index: number) {
  const input = e.target as HTMLInputElement
  const value = (e.target as HTMLInputElement).value

  if (!isAllowedLetter(value) && value !== ' ')
    return input.value = ''

  setGuessingWordLetter(value, index)
  focusInput(index + 1)
}

function onKeyDown(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace') {
    if (e.ctrlKey || e.shiftKey) {
      wordleStore.clearGuessingWord()
      focusInput(0)
      return
    }

    if (wordleStore.currentGuess[index] !== null) {
      setGuessingWordLetter(null, index)
    }
    else {
      setGuessingWordLetter(null, index - 1)
      focusInput(index - 1)
    }
  }

  else if (e.key.length === 1 && isAllowedLetter(e.key) && wordleStore.currentGuess[index] !== null) {
    setGuessingWordLetter(e.key, index)
    focusInput(index + 1)
  }

  else if (e.key === 'ArrowLeft') {
    focusInput(index - 1)
  }

  else if (e.key === 'ArrowRight') {
    focusInput(index + 1)
  }

  else if (e.key === 'Enter' && !wordleStore.currentGuess.includes(null)) {
    wordleStore.submitGuess()
    wordleStore.clearGuessingWord()
    focusInput(0)
  }
}
</script>

<template>
  <WordContainer v-if="wordleStore.word">
    <LetterCell v-for="(_, index) in wordleStore.currentGuess" ref="LetterCells" :key="index">
      <input
        ref="inputs"
        v-bounce="wordleStore.currentGuess[index]"
        type="text"
        maxlength="1"
        :value="wordleStore.currentGuess[index]"
        :autofocus="index === 0"
        class="w-full h-full text-center capitalize bg-transparent border-2 rounded outline-none caret-transparent border-neutral-500 focus:border-neutral-200"
        @input="e => onInput(e, index)"
        @keydown="e => onKeyDown(e, index)"
      >
    </LetterCell>
  </WordContainer>
</template>
