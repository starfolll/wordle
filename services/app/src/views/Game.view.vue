<script setup lang="ts">
import CircleButton from '@/components/CircleButton.vue'
import HowToPlay from '@/components/HowToPlay.vue'
import Keyboard from '@/components/keyboard/Keyboard.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/Streak.vue'
import MiniWallet from '@/components/wallets/CoinMiniWallet.vue'
import GuessedRow from '@/components/wordRows/GuessedRow.vue'
import GuessingRow from '@/components/wordRows/GuessingRow.vue'
import RemainingRow from '@/components/wordRows/RemainingRow.vue'
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { useGamesProgressStore } from '@/stores/gamesProgress.store'
import { useWordleStore } from '@/stores/wordle.store'
import { GameProgressType } from 'types.app'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()
const gamesProgressStore = useGamesProgressStore()

const loading = ref(false)

const isShowingHowToPlay = ref(false)
const closeHowToPlay = () => isShowingHowToPlay.value = false

const gameProgressNameToDisplay = {
  [GameProgressType.classicFourLettersGameProgress]: 'Classic 4 Letters',
  [GameProgressType.classicFiveLettersGameProgress]: 'Classic 5 Letters',
  [GameProgressType.dailyChallengeGameProgress]: 'Daily Challenge',
  [GameProgressType.withHintGameProgress]: 'With Hint',
}

async function submitGuess() {
  if (!wordleStore.gameProgress)
    return

  loading.value = true
  if (wordleStore.gameProgress.gameType === GameProgressType.dailyChallengeGameProgress)
    await gamesProgressStore.submitDailyChallengeGuess(wordleStore.gameProgress, wordleStore.currentGuess.join(''))
  else
    await gamesProgressStore.submitGuess(wordleStore.gameProgress, wordleStore.currentGuess.join(''))

  loading.value = false
  wordleStore.clearGuessingWord()
}

async function nextWord() {
  if (!wordleStore.gameProgress || wordleStore.gameProgress.gameType === GameProgressType.dailyChallengeGameProgress)
    return

  loading.value = true
  await gamesProgressStore.getNextWord(wordleStore.gameProgress.gameType)
  wordleStore.setGameProgress(gamesProgressStore.gameTypeToGameProgressRef[wordleStore.gameProgress.gameType])
  loading.value = false
}

const nextWordButton = ref<HTMLButtonElement | null>(null)
watchEffect(() => {
  wordleStore.isGameOver && requestAnimationFrame(() => nextWordButton.value?.focus())
})
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full gap-4 p-2 pb-0">
    <nav class="flex items-center justify-between w-full gap-2 p-2 rounded-lg">
      <CircleButton @click="router.go(-1)">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </CircleButton>

      <div class="flex items-center justify-center gap-4 text-xl">
        <Streak v-if="wordleStore.streak" :streak="wordleStore.streak" />
        <MiniWallet />
      </div>

      <CircleButton @click="isShowingHowToPlay = true">
        <font-awesome-icon :icon="['fas', 'question']" />
      </CircleButton>

      <HowToPlay v-model:open="isShowingHowToPlay" :close="closeHowToPlay" />
    </nav>

    <section class="relative flex flex-col gap-2 p-2 m-auto rounded-lg bg-neutral-900/70 backdrop-blur">
      <div class="absolute px-4 py-1 -mb-1 font-semibold -translate-x-1/2 rounded-full text-md left-1/2 bottom-full text-nowrap bg-neutral-800">
        <template v-if="!wordleStore.isGameOver">
          {{ wordleStore.gameType ? gameProgressNameToDisplay[wordleStore.gameType] : '' }}
        </template>
        <template v-else>
          <template v-if="wordleStore.isWon">
            Congratulations! You Won!
          </template>
          <template v-else>
            The word was
            <span class="text-green-400">{{ wordleStore.word?.toUpperCase() }}</span>
          </template>
        </template>
      </div>

      <GuessedRow v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />
      <GuessingRow v-if="!wordleStore.isGameOver" :submit-guess="submitGuess" />
      <RemainingRow v-for="i in wordleStore.remainingGuesses - (wordleStore.isGameOver ? 0 : 1)" :key="i" />
    </section>

    <section>
      <Keyboard />
    </section>

    <section class="py-8">
      <button
        v-if="!wordleStore.isGameOver"
        v-squash-on-click
        v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
        :disabled="!wordleStore.isGuessSubmittable || wordleStore.isGameOver || false"
        class="primary"
        @click="submitGuess"
      >
        Submit
      </button>
      <button
        v-else-if="wordleStore.gameProgress?.gameType === GameProgressType.dailyChallengeGameProgress"
        class="primary"
        @click="router.push('/')"
      >
        <font-awesome-icon :icon="['fas', 'home']" />
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
    </section>
  </main>
</template>
