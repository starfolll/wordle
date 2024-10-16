<script setup lang="ts">
import HowToPlay from '@/components/HowToPlay.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Streak from '@/components/Streak.vue'
import Wallet from '@/components/Wallet.vue'
import { type GameProgress, GameType, useProgressStore } from '@/stores/progress.store'
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()
const progressStore = useProgressStore()

const loading = ref(false)

const isShowingHowToPlay = ref(false)
const closeHowToPlay = () => isShowingHowToPlay.value = false

async function startGame(progress: GameProgress) {
  loading.value = true

  if (!progress.wordInfo) {
    const wordLength = progress.gameType === GameType.classic ? progress.wordLength : undefined
    progress.wordInfo = await wordleStore.fetchNewWord(wordLength)
  }

  wordleStore.setGameProgress(progress)

  loading.value = false
  router.push('/game')
}
</script>

<template>
  <main class="grid content-center h-full gap-4 min-w-72">
    <div class="flex items-center justify-between w-full px-2 border-transparent border-x-2">
      <h1 class="text-4xl text-left text-current-100">
        Wordle
      </h1>

      <button
        class="w-10 h-10 transition-colors rounded-full bg-current-800 hover:bg-current-700"
        @click="(e) => isShowingHowToPlay = !isShowingHowToPlay"
      >
        <font-awesome-icon :icon="['fas', 'question']" />
      </button>

      <HowToPlay v-if="isShowingHowToPlay" :close="closeHowToPlay" />
    </div>

    <LoadingBox
      :loading="loading"
      class="grid w-full gap-2 p-2 overflow-hidden rounded-lg bg-neutral-800"
    >
      <h2 class="mb-2 text-3xl text-current-400">
        Classic
      </h2>

      <button
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700 hover:bg-neutral-600"
        @click="startGame(progressStore.classic4Letters)"
      >
        4 letters

        <Streak
          v-if="progressStore.classic4Letters.streak"
          class="text-xl"
          :streak="progressStore.classic4Letters.streak"
        />

        <font-awesome-icon
          v-else
          class="mr-2 text-current-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </button>

      <button
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700 hover:bg-neutral-600"
        @click="startGame(progressStore.classic5Letters)"
      >
        5 letters

        <Streak
          v-if="progressStore.classic5Letters.streak"
          class="text-xl"
          :streak="progressStore.classic5Letters.streak"
        />

        <font-awesome-icon
          v-else
          class="mr-2 text-current-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </button>
    </LoadingBox>

    <div class="flex gap-4">
      <LoadingBox
        :loading="loading"
        class="grid w-full gap-2 p-2 overflow-hidden rounded-lg grow bg-neutral-800"
      >
        <h2 class="mb-2 text-3xl text-current-400">
          With hints
        </h2>

        <button
          :disabled="loading"
          class="flex items-center justify-between py-1 pl-3 pr-1 text-2xl transition-colors rounded bg-neutral-700 hover:bg-neutral-600"
          @click="startGame(progressStore.withHints)"
        >
          Play

          <Streak
            v-if="progressStore.withHints.streak"
            class="text-xl"
            :streak="progressStore.withHints.streak"
          />

          <font-awesome-icon
            v-else
            class="mr-2 text-current-400"
            :icon="['fas', 'arrow-right']"
            size="sm"
          />
        </button>
      </LoadingBox>

      <RouterLink
        to="/store"
        class="text-xl aspect-square group"
      >
        <div class="flex flex-col items-center justify-center h-full gap-4 transition-colors rounded-lg bg-amber-400 group-hover:bg-amber-500">
          <font-awesome-icon class="text-amber-800" :icon="['fas', 'store']" size="lg" />
          <Wallet class="transition-colors group-hover:border-amber-500" />
        </div>
      </RouterLink>
    </div>
  </main>
</template>
