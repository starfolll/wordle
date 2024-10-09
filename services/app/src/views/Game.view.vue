<script setup lang="ts">
import Keyboard from '@/components/keyboard/Keyboard.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { useWordleStore } from '@/stores/wordle.store'
import { useRouter } from 'vue-router'

const wordleStore = useWordleStore()

const router = useRouter()

const navigateBack = () => router.go(-1)
const navigateHome = () => router.push('/')
</script>

<template>
  <main class="flex items-center justify-center h-full">
    <div class="flex flex-col items-center justify-center gap-12 w-min">
      <nav class="flex items-center justify-between w-full gap-2">
        <button class="w-12 rounded-full bg-neutral-800 aspect-square" @click="navigateBack">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>

        <h1 class="text-xl">
          <template v-if="!wordleStore.isGameOver">
            Try to guess the word!
          </template>
          <template v-else>
            <template v-if="wordleStore.isWon">
              Congratulations! You WON!
            </template>
            <template v-else>
              The word was:
              <span class="text-green-400">{{ wordleStore.word?.toUpperCase() }}</span>
            </template>
          </template>
        </h1>

        <button class="w-12 rounded-full bg-neutral-800 aspect-square" @click="navigateHome">
          <font-awesome-icon :icon="['fas', 'house']" />
        </button>
      </nav>

      <div class="flex flex-col gap-2">
        <GuessedRow v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />
        <GuessingRow v-if="!wordleStore.isGameOver" />
        <RemainingRow v-for="i in wordleStore.remainingGuesses - (wordleStore.isGameOver ? 0 : 1)" :key="i" />
      </div>

      <Keyboard />

      <button
        v-squash-on-click
        v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
        :disabled="!wordleStore.isGuessSubmittable || wordleStore.isGameOver || false"
        class="primary"
        @click="wordleStore.submitGuess"
      >
        Submit
      </button>
    </div>
  </main>
</template>
