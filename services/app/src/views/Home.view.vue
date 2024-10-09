<script setup lang="ts">
import LoadingBox from '@/components/LoadingBox.vue'
import { type GameProgress, useProgressStore } from '@/stores/progress.store'
import { useWordleStore } from '@/stores/wordle.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const wordleStore = useWordleStore()
const progressStore = useProgressStore()

const loading = ref(false)

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
  <div class="flex flex-col items-center justify-center h-full">
    <main class="grid gap-4 min-w-72">
      <h1 class="font-mono text-4xl text-left">
        Wordle
      </h1>

      <LoadingBox
        :loading="loading"
        class="grid border-2 overflow-hidden border-neutral-800 rounded-lg p-2 grid-cols-[1fr,auto] gap-2"
      >
        <h2 class="text-3xl text-green-400">
          Classic
        </h2>
        <p class="mt-auto text-center">
          Streak
        </p>

        <button
          :disabled="loading"
          class="flex items-center content-between px-4 py-1 text-2xl text-green-900 bg-green-400 rounded"
          @click="startClassicGame(4, progressStore.classic4Letters)"
        >
          4 letters
          <font-awesome-icon
            v-if="progressStore.classic4Letters.word"
            class="ml-auto"
            :icon="['fas', 'arrow-right']"
            size="sm"
          />
        </button>
        <div class="flex items-center justify-center text-xl rounded aspect-square bg-neutral-800">
          {{ progressStore.classic4Letters.streak }}
        </div>

        <button
          :disabled="loading"
          class="flex items-center content-between px-4 py-1 text-2xl text-green-900 bg-green-400 rounded"
          @click="startClassicGame(5, progressStore.classic5Letters)"
        >
          5 letters
          <font-awesome-icon
            v-if="progressStore.classic5Letters.word"
            class="ml-auto"
            :icon="['fas', 'arrow-right']"
            size="sm"
          />
        </button>
        <div class="flex items-center justify-center text-xl rounded aspect-square bg-neutral-800">
          {{ progressStore.classic5Letters.streak }}
        </div>
      </LoadingBox>
    </main>
  </div>
</template>
