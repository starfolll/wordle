<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import { onMounted, ref } from 'vue'
import WordCell from './WordCell.vue'
import WordsContainer from './WordsContainer.vue'

const wordleStore = useWordleStore()

const getClearWord = () => Array.from<null>({ length: wordleStore.lettersInWord }).fill(null)
const inputs = ref<HTMLInputElement[]>([])
const guessingWord = ref<Array<string | null>>(getClearWord())

const isAllowedLetter = (char: string) => /[a-z]/i.test(char)
const focusInput = (index: number) => requestAnimationFrame(() => inputs.value[index]?.focus())

function clearGuessingWord() {
  guessingWord.value = getClearWord()
  focusInput(0)
}

function onInput(e: Event, index: number) {
  const input = e.target as HTMLInputElement
  const value = (e.target as HTMLInputElement).value

  if (!isAllowedLetter(value) && value !== ' ')
    return input.value = ''

  guessingWord.value[index] = value === ' ' ? null : value.toLowerCase()
  focusInput(index + 1)
}

function onKeyDown(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace') {
    if (e.shiftKey) {
      guessingWord.value = getClearWord()
      focusInput(0)
    }
    else {
      guessingWord.value[index] = null
      focusInput(index - 1)
    }
  }

  else if (e.key.length === 1 && isAllowedLetter(e.key) && guessingWord.value[index] !== null) {
    guessingWord.value[index] = e.key
    focusInput(index + 1)
  }

  else if (e.key === 'ArrowLeft') {
    focusInput(index - 1)
  }

  else if (e.key === 'ArrowRight') {
    focusInput(index + 1)
  }

  else if (e.key === 'Enter' && !guessingWord.value.includes(null)) {
    const success = wordleStore.submitGuess(guessingWord.value.join(''))

    if (success)
      clearGuessingWord()
  }
}

onMounted(() => {
  inputs.value[0]?.focus()
})
</script>

<template>
  <WordsContainer v-if="wordleStore.word">
    <WordCell v-for="(_, index) in guessingWord" :key="index">
      <input
        ref="inputs"
        :value="guessingWord[index]"
        type="text"
        class="w-full h-full text-center capitalize bg-transparent border-2 rounded outline-none caret-transparent border-neutral-500 focus:border-neutral-200"
        maxlength="1"
        @input="e => onInput(e, index)"
        @keydown="e => onKeyDown(e, index)"
      >
    </WordCell>
  </WordsContainer>
</template>
