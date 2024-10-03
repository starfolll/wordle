<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import { onMounted, ref } from 'vue'
import WordCell from './WordCell.vue'
import WordsContainer from './WordsContainer.vue'

const wordleStore = useWordleStore()

const getClearWord = () => Array.from<null>({ length: wordleStore.lettersInWord }).fill(null)
const inputs = ref<HTMLInputElement[]>([])
const wordCells = ref<typeof WordCell[]>([])
const guessingWord = ref<Array<string | null>>(getClearWord())

const isAllowedLetter = (char: string) => /[a-z]/i.test(char)
const focusInput = (index: number) => requestAnimationFrame(() => inputs.value[index]?.focus())

function setGuessingWordLetter(letter: string | null, index: number) {
  guessingWord.value[index] = letter ? letter.toLowerCase() : letter
  wordCells.value[index].container.classList.remove('bounce')
  requestAnimationFrame(() => wordCells.value[index].container.classList.add('bounce'))
}
function clearGuessingWord() {
  guessingWord.value = getClearWord()
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
      guessingWord.value = getClearWord()
      focusInput(0)
    }
    else {
      setGuessingWordLetter(null, index)
      focusInput(index - 1)
    }
  }

  else if (e.key.length === 1 && isAllowedLetter(e.key) && guessingWord.value[index] !== null) {
    setGuessingWordLetter(e.key, index)
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
</script>

<template>
  <WordsContainer v-if="wordleStore.word">
    <WordCell v-for="(_, index) in guessingWord" ref="wordCells" :key="index">
      <input
        ref="inputs"
        type="text"
        maxlength="1"
        :value="guessingWord[index]"
        :autofocus="index === 0"
        class="w-full h-full text-center capitalize bg-transparent border-2 rounded outline-none caret-transparent border-neutral-500 focus:border-neutral-200"
        @input="e => onInput(e, index)"
        @keydown="e => onKeyDown(e, index)"
      >
    </WordCell>
  </WordsContainer>
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
