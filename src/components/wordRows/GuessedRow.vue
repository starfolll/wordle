<script setup lang="ts">
import { letterClassName, useWordleStore } from '@/stores/wordle.store'
import LetterCell from './LetterCell.vue'
import WordContainer from './WordContainer.vue'

defineProps<{
  word: string
}>()

const wordleStore = useWordleStore()
</script>

<template>
  <WordContainer v-if="wordleStore.word">
    <LetterCell
      v-for="(letter, index) in word"
      :key="index"
      class="flip"
      :style="{ '--index': index }"
      :tw-class="letterClassName[wordleStore.getLetterTag(letter, index)]"
    >
      {{ letter }}
    </LetterCell>
  </WordContainer>
</template>
