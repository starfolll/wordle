<script setup lang="ts">
import type { TMatchingLetterTag } from '@/stores/wordle.store'
import { matchingLetterTagToClass, useWordleStore } from '@/stores/wordle.store'
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
      :tw-class="matchingLetterTagToClass[wordleStore.getLetterTag(letter, index)]"
    >
      {{ letter }}
    </LetterCell>
  </WordContainer>
</template>

<style scoped>
@keyframes flip {
  0% {
    transform: rotateY(0deg);
    @apply text-neutral-100 bg-neutral-800;
  }
  50% {
    @apply text-neutral-100 bg-neutral-800;
    transform: rotateY(90deg);
  }
  51% {
    @apply text-inherit bg-inherit;
  }
  100% {
    transform: rotateY(0deg);
  }
}

.flip {
  animation-name: flip;
  animation-duration: 0.3s;
  animation-delay: calc(var(--index) * 0.1s);
  animation-timing-function: linear;
  animation-fill-mode: both;
}
</style>
