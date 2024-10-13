<script setup lang="ts">
import HowToPlay from '@/components/HowToPlay.vue'
import LoadingBox from '@/components/LoadingBox.vue'
import Wallet from '@/components/Wallet.vue'
import { type GameProgress, useProgressStore } from '@/stores/progress.store'
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()
const progressStore = useProgressStore()

const loading = ref(false)

const isShowingHowToPlay = ref(false)
const closeHowToPlay = () => isShowingHowToPlay.value = false

async function startClassicGame(wordLength: 4 | 5, progress: GameProgress) {
  loading.value = true

  if (!progress.word)
    progress.word = await wordleStore.fetchNewWord(wordLength)

  wordleStore.setGameProgress(progress)

  loading.value = false
  router.push('/game')
}

// game modes:
// 1. regular game (4/5 letters) (with game Streak counter)
// 2. learning words (A1, A2, B1, B2, C1, C2) (roadmap)
// 3. long words with 5+ letters, 3 guesses, but with a hint, separated by english level
</script>

<template>
  <main class="grid gap-4 min-w-72">
    <div class="flex items-center justify-between px-2 border-transparent border-x-2">
      <h1 class="text-4xl text-left">
        Wordle
      </h1>

      <button
        class="w-10 h-10 transition-colors rounded-full bg-neutral-800 hover:bg-neutral-700"
        @click="(e) => isShowingHowToPlay = !isShowingHowToPlay"
      >
        <font-awesome-icon :icon="['fas', 'question']" />
      </button>

      <HowToPlay v-if="isShowingHowToPlay" :close="closeHowToPlay" />
    </div>

    <LoadingBox
      :loading="loading"
      class="grid gap-2 p-2 overflow-hidden border-2 rounded-lg bg-neutral-900 border-neutral-800"
    >
      <h2 class="text-3xl text-green-400">
        Classic
      </h2>

      <button
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-4 pr-1 text-2xl rounded bg-neutral-800"
        @click="startClassicGame(4, progressStore.classic4Letters)"
      >
        4 letters

        <div
          v-if="progressStore.classic4Letters.streak"
          class="relative flex items-center justify-center gap-2 px-2 py-1 text-xl text-white rounded bg-neutral-900"
        >
          <font-awesome-icon :icon="['fas', 'fire']" />
          {{ progressStore.classic4Letters.streak }}

          <div class="absolute top-0 left-0 w-full h-full rounded bg-gradient-to-r from-red-500 to-orange-400 mix-blend-darken" />
        </div>

        <font-awesome-icon
          v-else
          class="mr-2 text-green-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </button>

      <button
        :disabled="loading"
        class="flex items-center justify-between py-1 pl-4 pr-1 text-2xl rounded bg-neutral-800"
        @click="startClassicGame(5, progressStore.classic5Letters)"
      >
        5 letters

        <div
          v-if="progressStore.classic5Letters.streak"
          class="relative flex items-center justify-center gap-2 px-2 py-1 text-xl text-white rounded bg-neutral-900"
        >
          <font-awesome-icon :icon="['fas', 'fire']" />
          {{ progressStore.classic5Letters.streak }}

          <div class="absolute top-0 left-0 w-full h-full rounded bg-gradient-to-r from-red-500 to-orange-400 mix-blend-darken" />
        </div>

        <font-awesome-icon
          v-else
          class="mr-2 text-green-400"
          :icon="['fas', 'arrow-right']"
          size="sm"
        />
      </button>
    </LoadingBox>

    <RouterLink to="/store" class="flex gap-2 px-2 ml-auto border-2 border-transparent rounded-lg w-min group">
      <Wallet />

      <div class="flex items-center justify-center h-full text-xl transition-colors rounded-lg aspect-square bg-amber-900 text-amber-400 group-hover:bg-amber-800">
        <font-awesome-icon :icon="['fas', 'store']" size="lg" />
      </div>
    </RouterLink>
  </main>
</template>
