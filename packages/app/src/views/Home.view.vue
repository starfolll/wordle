<script setup lang="ts">
import type { TGameProgressData } from 'types'
import DailyChallengeWeek from '@/components/daily-challenge.vue/daily-challenge-week.vue'
import HowToPlay from '@/components/how-to-play/how-to-play.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/streak.vue'
import ButtonBase from '@/components/ui/buttons/button-base.vue'
import ButtonCircle from '@/components/ui/buttons/button-circle.vue'
import WalletCoin from '@/components/wallets/wallet-coin.vue'
import WalletDiamond from '@/components/wallets/wallet-diamond.vue'
import { useGamesProgressStore } from '@/stores/gamesProgress.store'
import { useWordleStore } from '@/stores/wordle.store'
import { getToday } from 'dates'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()
const gamesProgressStore = useGamesProgressStore()

const loading = ref(false)

const isShowingHowToPlay = ref(false)
const closeHowToPlay = () => isShowingHowToPlay.value = false

async function startGame(progress: TGameProgressData) {
  loading.value = true

  wordleStore.setGameProgress(progress)

  loading.value = false
  router.push('/game')
}

async function startDailyChallenge(date: string) {
  loading.value = true

  if (!gamesProgressStore.dailyChallenges)
    return

  const today = getToday()
  const dailyChallenge = gamesProgressStore.dailyChallenges[date]

  if (!dailyChallenge && date !== today.toISOString())
    return

  const gameProgress = dailyChallenge ?? await gamesProgressStore.getDailyChallengeWord()

  if (!gamesProgressStore.dailyChallenges[date])
    gamesProgressStore.dailyChallenges[date] = gameProgress

  wordleStore.setGameProgress(gameProgress)

  loading.value = false
  router.push('/game')
}
</script>

<template>
  <main class="grid content-center h-full gap-8 p-2 min-w-72">
    <section class="flex items-center justify-between w-full px-2 border-transparent border-x-2">
      <div class="px-4 py-2 text-4xl font-semibold rounded-lg text-current-100 bg-neutral-900/90">
        Wordle Plus
      </div>

      <ButtonCircle @click="(e) => isShowingHowToPlay = !isShowingHowToPlay">
        <font-awesome-icon :icon="['fas', 'question']" />
      </ButtonCircle>

      <HowToPlay v-model:open="isShowingHowToPlay" :close="closeHowToPlay" />
    </section>

    <LoadingBox
      is="section"
      :loading="loading"
      class="grid w-full gap-2 p-2 overflow-hidden rounded-lg bg-neutral-900/90"
    >
      <h2 class="text-2xl text-current-400">
        Classic
      </h2>

      <ButtonBase
        v-if="gamesProgressStore.classicFourLetters"
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700"
        @click="startGame(gamesProgressStore.classicFourLetters)"
      >
        4 letters

        <Streak
          v-if="gamesProgressStore.classicFourLetters.streak"
          class="text-xl"
          :streak="gamesProgressStore.classicFourLetters.streak"
        />

        <font-awesome-icon
          v-else
          class="mr-2 text-current-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </ButtonBase>

      <ButtonBase
        v-if="gamesProgressStore.classicFiveLetters"
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700"
        @click="startGame(gamesProgressStore.classicFiveLetters)"
      >
        5 letters

        <Streak
          v-if="gamesProgressStore.classicFiveLetters.streak"
          class="text-xl"
          :streak="gamesProgressStore.classicFiveLetters.streak"
        />

        <font-awesome-icon
          v-else
          class="mr-2 text-current-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </ButtonBase>
    </LoadingBox>

    <LoadingBox
      is="section"
      :loading="loading"
      class="grid w-full gap-2 p-2 overflow-hidden grow"
    >
      <div class="flex items-center gap-2">
        <h2 class="px-4 py-2 text-2xl rounded-lg text-current-400 bg-neutral-900/90">
          Daily challenge
        </h2>

        <WalletDiamond class="ml-auto" />
      </div>

      <DailyChallengeWeek :start-daily-challenge="startDailyChallenge" />
    </LoadingBox>

    <section class="flex gap-8">
      <LoadingBox
        :loading="loading"
        class="grid content-between w-full gap-2 p-2 overflow-hidden rounded-lg grow bg-neutral-900/90"
      >
        <h2 class="text-2xl text-current-400">
          With hint
        </h2>

        <ButtonBase
          v-if="gamesProgressStore.withHint"
          :disabled="loading"
          class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700"
          @click="startGame(gamesProgressStore.withHint)"
        >
          Play

          <Streak
            v-if="gamesProgressStore.withHint.streak"
            class="text-xl"
            :streak="gamesProgressStore.withHint.streak"
          />

          <font-awesome-icon
            v-else
            class="mr-2 text-current-400"
            :icon="['fas', 'arrow-right']"
            size="sm"
          />
        </ButtonBase>
      </LoadingBox>

      <ButtonBase
        class="text-xl aspect-square group flex flex-col px-1 py-2 items-center justify-center h-full gap-4 transition-colors rounded-lg bg-amber-400"
        @click="router.push('/store')"
      >
        <font-awesome-icon class="text-amber-800" :icon="['fas', 'store']" size="lg" />
        <WalletCoin class="transition-colors" />
      </ButtonBase>
    </section>
  </main>
</template>
