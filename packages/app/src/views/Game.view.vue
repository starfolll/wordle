<script setup lang="ts">
import HowToPlay from '@/components/how-to-play/how-to-play.vue'
import Keyboard from '@/components/keyboard/keyboard.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/streak.vue'
import ButtonBase from '@/components/ui/buttons/button-base.vue'
import ButtonCircle from '@/components/ui/buttons/button-circle.vue'
import WalletCoinMini from '@/components/wallets/wallet-coin-mini.vue'
import WordRowGuessed from '@/components/word/word-row-guessed.vue'
import WordRowGuessing from '@/components/word/word-row-guessing.vue'
import WordRowRemaining from '@/components/word/word-row-remaining.vue'
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation } from '@/directives/animations/v-squash-on-click'
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
      <ButtonCircle @click="router.go(-1)">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </ButtonCircle>

      <div class="flex items-center justify-center gap-4 text-xl">
        <Streak v-if="wordleStore.streak" :streak="wordleStore.streak" />
        <WalletCoinMini />
      </div>

      <ButtonCircle @click="isShowingHowToPlay = true">
        <font-awesome-icon :icon="['fas', 'question']" />
      </ButtonCircle>

      <HowToPlay v-model:open="isShowingHowToPlay" :close="closeHowToPlay" />
    </nav>

    <section class="relative max-w-fit flex flex-col gap-2 w-full p-2 m-auto rounded-lg bg-neutral-900/70">
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

      <WordRowGuessed v-for="guess in wordleStore.guesses" :key="guess" :word="guess" />
      <WordRowGuessing v-if="!wordleStore.isGameOver" :submit-guess="submitGuess" />
      <WordRowRemaining v-for="i in wordleStore.remainingGuesses - (wordleStore.isGameOver ? 0 : 1)" :key="i" />
    </section>

    <section class="w-full max-w-fit">
      <Keyboard />
    </section>

    <section class="py-4">
      <ButtonBase
        v-if="!wordleStore.isGameOver"
        v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
        :disabled="!wordleStore.isGuessSubmittable || wordleStore.isGameOver || false"
        class="primary"
        @click="submitGuess"
      >
        Submit
      </ButtonBase>
      <ButtonBase
        v-else-if="wordleStore.gameProgress?.gameType === GameProgressType.dailyChallengeGameProgress"
        class="primary"
        @click="router.push('/')"
      >
        <font-awesome-icon :icon="['fas', 'home']" />
      </ButtonBase>
      <LoadingBox v-else :loading="loading">
        <ButtonBase
          ref="nextWordButton"
          v-global-key-press="(el, e) => !(el as HTMLButtonElement).disabled && e.key === 'Enter' && playSquashAnimation(el)"
          class="primary"
          :disabled="loading"
          @click="nextWord"
        >
          {{ wordleStore.isWon ? 'Next word' : 'Restart' }}
        </ButtonBase>
      </LoadingBox>
    </section>
  </main>
</template>
