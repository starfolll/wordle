<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import LetterCell from './LetterCell.vue'
import WordContainer from './WordContainer.vue'

const props = defineProps<{
  submitGuess: typeof wordleStore['submitGuess']
}>()

const wordleStore = useWordleStore()

const inputs = ref<HTMLInputElement[]>([])
const LetterCells = ref<typeof LetterCell[]>([])

const isAllowedLetter = (char: string) => /[a-z]/i.test(char)
const focusInput = (index: number) => requestAnimationFrame(() => inputs.value[index]?.focus())

function setGuessingWordLetter(letter: string | null, index: number) {
  wordleStore.guessingWord[index] = letter ? letter.toLowerCase() : letter
  LetterCells.value[index].container.classList.remove('bounce')
  requestAnimationFrame(() => LetterCells.value[index].container.classList.add('bounce'))
}
function clearGuessingWord() {
  wordleStore.clearGuessingWord()
  focusInput(0)
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
    }
    else {
      setGuessingWordLetter(null, index)
      focusInput(index - 1)
    }
  }

  else if (e.key.length === 1 && isAllowedLetter(e.key) && wordleStore.guessingWord[index] !== null) {
    setGuessingWordLetter(e.key, index)
    focusInput(index + 1)
  }

  else if (e.key === 'ArrowLeft') {
    focusInput(index - 1)
  }

  else if (e.key === 'ArrowRight') {
    focusInput(index + 1)
  }

  else if (e.key === 'Enter' && !wordleStore.guessingWord.includes(null)) {
    const success = props.submitGuess(wordleStore.guessingWord.join(''))

    if (success)
      clearGuessingWord()
  }
}
</script>

<template>
  <WordContainer v-if="wordleStore.word">
    <LetterCell v-for="(_, index) in wordleStore.guessingWord" ref="LetterCells" :key="index">
      <input
        ref="inputs"
        type="text"
        maxlength="1"
        :value="wordleStore.guessingWord[index]"
        :autofocus="index === 0"
        class="w-full h-full text-center capitalize bg-transparent border-2 rounded outline-none caret-transparent border-neutral-500 focus:border-neutral-200"
        @input="e => onInput(e, index)"
        @keydown="e => onKeyDown(e, index)"
      >
    </LetterCell>
  </WordContainer>
</template>

<style scoped>
@keyframes bounce {
  0% { scale: 1; }
  50% { scale: 1.1; }
  100% { scale: 1; }
}

.bounce {
  animation-name: bounce;
  animation-duration: 0.2s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
}
</style>
