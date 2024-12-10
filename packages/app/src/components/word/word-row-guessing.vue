<script setup lang="ts">
import { vBounce } from '@/directives/animations/v-bounce'
import { useWordleStore } from '@/stores/wordle.store'
import { onMounted, ref } from 'vue'
import WordContainer from './word-container.vue'
import WordLetter from './word-letter.vue'

const props = defineProps<{
  submitGuess: () => void
}>()

const wordleStore = useWordleStore()

const inputs = ref<HTMLInputElement[]>([])
const WordLetters = ref<typeof WordLetter[]>([])

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
    props.submitGuess()
    focusInput(0)
  }
}

onMounted(() => {
  focusInput(0)
})
</script>

<template>
  <WordContainer v-if="wordleStore.word">
    <WordLetter
      v-for="(_, index) in wordleStore.currentGuess"
      :key="index"
      ref="WordLetters"
      tw-class="bg-current-800"
    >
      <input
        ref="inputs"
        v-bounce="wordleStore.currentGuess[index]"
        type="text"
        maxlength="1"
        :value="wordleStore.currentGuess[index]"
        class="w-full h-full text-center capitalize bg-transparent border-2 rounded outline-none caret-transparent border-current-500 focus:border-current-200"
        @input="e => onInput(e, index)"
        @keydown="e => onKeyDown(e, index)"
      >
    </WordLetter>
  </WordContainer>
</template>
