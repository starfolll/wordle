<script setup lang="ts">
import type { TMatchingLetterTag } from '@/stores/wordle.store'
import { useWordleStore } from '@/stores/wordle.store'
import WordCell from './WordCell.vue'
import WordsContainer from './WordsContainer.vue'

defineProps<{
  word: string
}>()

const wordleStore = useWordleStore()

const matchingLetterTagToClass = {
  exact: '!bg-lime-400 !text-lime-900',
  partial: '!bg-yellow-400 !text-yellow-900',
  none: '',
} satisfies Record<TMatchingLetterTag, string>
</script>

<template>
  <WordsContainer v-if="wordleStore.word">
    <WordCell
      v-for="(letter, index) in word"
      :key="index"
      :class="[matchingLetterTagToClass[wordleStore.getLetterTag(letter, index)]]"
    >
      {{ letter }}
    </WordCell>
  </WordsContainer>
</template>
