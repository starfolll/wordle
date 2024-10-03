<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import WordCell from './LetterCell.vue'
import WordsContainer from './WordContainer.vue'

const wordleStore = useWordleStore()
</script>

<template>
  <WordsContainer>
    <WordCell v-for="i in wordleStore.lettersInWord" :key="i" />
  </WordsContainer>
</template>
