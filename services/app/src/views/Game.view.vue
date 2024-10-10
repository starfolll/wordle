<script setup lang="ts">
import Keyboard from '@/components/keyboard/Keyboard.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/Streak.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()

const loading = ref(false)

const navigateBack = () => router.go(-1)
const navigateHome = () => router.push('/')

async function nextWord() {
  loading.value = true
  await wordleStore.nextWord()
  loading.value = false
}
</script>

<template>
  <main class="flex items-center justify-center h-full">
    <div class="flex flex-col items-center justify-center gap-12">
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

      <div class="grid gap-2">
        <Streak />
        <Keyboard />
      </div>

      <button
        v-if="!wordleStore.isGameOver"
        v-squash-on-click
        v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
        :disabled="!wordleStore.isGuessSubmittable || wordleStore.isGameOver || false"
        class="primary"
        @click="() => { wordleStore.submitGuess(); wordleStore.clearGuessingWord(); }"
      >
        Submit
      </button>
      <LoadingBox v-else :loading="loading">
        <button
          v-squash-on-click
          v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
          class="primary"
          :disabled="loading"
          @click="nextWord"
        >
          {{ wordleStore.isWon ? 'Next word' : 'Restart' }}
        </button>
      </LoadingBox>
    </div>
  </main>
</template>
