<script setup lang="ts">
import HowToPlay from '@/components/HowToPlay.vue'
import Keyboard from '@/components/keyboard/Keyboard.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/Streak.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { useWordleStore } from '@/stores/wordle.store'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()

const loading = ref(false)
const isShowingHowToPlay = ref(false)
const closeHowToPlay = () => isShowingHowToPlay.value = false

async function nextWord() {
  loading.value = true
  await wordleStore.nextWord()
  loading.value = false
}

const nextWordButton = ref<HTMLButtonElement | null>(null)
watchEffect(() => {
  wordleStore.isGameOver && requestAnimationFrame(() => nextWordButton.value?.focus())
})
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full gap-12">
    <nav class="flex items-center justify-between w-full gap-2 p-2 rounded-lg bg-neutral-900">
      <button class="w-12 rounded-full bg-current-800 aspect-square" @click="router.go(-1)">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>

      <div class="flex flex-col justify-center gap-2">
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

        <Streak class="text-xl" :streak="wordleStore.streak" />
      </div>

      <button class="w-12 rounded-full bg-current-800 aspect-square" @click="isShowingHowToPlay = true">
        <font-awesome-icon :icon="['fas', 'question']" />
      </button>

      <HowToPlay v-if="isShowingHowToPlay" :close="closeHowToPlay" />
    </nav>

    <div class="grow">
      <div class="flex flex-col gap-2 p-2 rounded-lg bg-neutral-900">
        <GuessedRow v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />
        <GuessingRow v-if="!wordleStore.isGameOver" />
        <RemainingRow v-for="i in wordleStore.remainingGuesses - (wordleStore.isGameOver ? 0 : 1)" :key="i" />
      </div>
    </div>

    <Keyboard />

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
        ref="nextWordButton"
        v-squash-on-click
        v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
        class="primary"
        :disabled="loading"
        @click="nextWord"
      >
        {{ wordleStore.isWon ? 'Next word' : 'Restart' }}
      </button>
    </LoadingBox>
  </main>
</template>
