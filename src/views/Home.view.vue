<script setup lang="ts">
import Keyboard from '@/components/Keyboard.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { useWordleStore } from '@/stores/wordle.store'
import { onMounted } from 'vue'

const wordleStore = useWordleStore()

onMounted(wordleStore.fetchNewWord)
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full gap-12">
    <h1 class="text-2xl">
      Try to guess the word! {{ wordleStore.word }}
    </h1>

    <div v-if="wordleStore.isGameOver">
      <p v-if="wordleStore.isWon">
        Congratulations! You WON!
      </p>

      <p v-if="!wordleStore.isWon">
        The word was: {{ wordleStore.word?.toUpperCase() }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <GuessedRow v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />

      <template v-if="!wordleStore.isGameOver">
        <GuessingRow />

        <RemainingRow v-for="i in wordleStore.remainingGuesses - 1" :key="i" />
      </template>
    </div>

    <Keyboard />
  </main>
</template>
