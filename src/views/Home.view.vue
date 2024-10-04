<script setup lang="ts">
import Keyboard from '@/components/keyboard/Keyboard.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { useWordleStore } from '@/stores/wordle.store'
import { onMounted } from 'vue'

const wordleStore = useWordleStore()

const submitGuess: typeof wordleStore['submitGuess'] = (word: string) => {
  return wordleStore.submitGuess(word)
}

onMounted(wordleStore.fetchNewWord)
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full gap-12">
    <h1 class="text-2xl">
      <template v-if="!wordleStore.isGameOver">
        Try to guess the word! {{ wordleStore.word }}
      </template>
      <template v-else>
        <template v-if="wordleStore.isWon">
          Congratulations! You WON!
        </template>
        <template v-else>
          The word was: {{ wordleStore.word?.toUpperCase() }}
        </template>
      </template>
    </h1>

    <div class="flex flex-col gap-2">
      <GuessedRow v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />
      <GuessingRow v-if="!wordleStore.isGameOver" :submit-guess="submitGuess" />
      <RemainingRow v-for="i in wordleStore.remainingGuesses - (wordleStore.isGameOver ? 0 : 1)" :key="i" />
    </div>

    <Keyboard />

    <button class="px-8 py-2 text-3xl font-bold text-green-900 bg-green-400 rounded-full">
      Submit
    </button>
  </main>
</template>
