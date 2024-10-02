<script setup lang="ts">
import { useWordleStore } from '@/stores/wordle.store'
import WordCell from './WordCell.vue'
import WordsContainer from './WordsContainer.vue'

const wordleStore = useWordleStore()
</script>

<template>
  <WordsContainer>
    <WordCell v-for="i in wordleStore.lettersInWord" :key="i" />
  </WordsContainer>
</template>
