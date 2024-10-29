<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import LetterCell from './LetterCell.vue'
import WordContainer from './WordContainer.vue'

const wordleStore = useWordleStore()
</script>

<template>
  <WordContainer>
    <LetterCell
      v-for="i in wordleStore.wordLength"
      :key="i"
    />
  </WordContainer>
</template>
