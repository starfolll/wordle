<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import WordContainer from './word-container.vue'
import WordLetter from './word-letter.vue'

const wordleStore = useWordleStore()
</script>

<template>
  <WordContainer>
    <WordLetter
      v-for="i in wordleStore.wordLength"
      :key="i"
    />
  </WordContainer>
</template>
