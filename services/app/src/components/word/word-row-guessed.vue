<script setup lang="ts">
import { letterClassName } from '@/helpers/class-names/matching-letter'
import { useWordleStore } from '@/stores/wordle.store'
import WordContainer from './word-container.vue'
import WordLetter from './word-letter.vue'

defineProps<{
  word: string
}>()

const wordleStore = useWordleStore()
</script>

<template>
  <WordContainer v-if="wordleStore.word">
    <WordLetter
      v-for="(letter, index) in word"
      :key="index"
      :class="wordleStore.guessedLettersAppearAnimation"
      :style="{ '--index': index }"
      :tw-class="letterClassName[wordleStore.getLetterTag(letter, index)] || 'bg-neutral-800'"
    >
      {{ letter }}
    </WordLetter>
  </WordContainer>
</template>
