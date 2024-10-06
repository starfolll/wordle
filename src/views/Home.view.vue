<script setup lang="ts">
import LoadingBox from '@/components/LoadingBox.vue'
import { useWordleStore } from '@/stores/wordle.store'
import { useRouter } from 'vue-router'

const router = useRouter()
const wordleStore = useWordleStore()

const startGame = {
  classic4Letters: () => {
    wordleStore.clearStore()
    wordleStore.setWord('word')
    router.push('/game')
  },
  classic5Letters: () => {
    wordleStore.clearStore()
    wordleStore.setWord('hello')
    router.push('/game')
  },
}

// game modes:
// 1. regular game (4/5 letters) (with game strick counter)
// 2. long words with 5+ letters, 3 guesses, but with a hint, separated by english level (A1, A2, B1, B2, C1, C2)
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <main class="grid gap-4">
      <h1 class="font-mono text-4xl text-left">
        Wordle
      </h1>

      <LoadingBox
        :loading="wordleStore.loading"
        class="grid border-2 overflow-hidden border-neutral-800 rounded-lg p-2 grid-cols-[1fr,auto] gap-2"
      >
        <h2 class="text-3xl text-green-400">
          Classic
        </h2>
        <p class="mt-auto text-center">
          Strick
        </p>

        <button
          :disabled="wordleStore.loading"
          class="px-4 py-2 text-2xl text-green-900 bg-green-300 rounded"
          @click="startGame.classic4Letters"
        >
          Classic 4 letters
        </button>
        <div class="flex items-center justify-center px-4 py-2 text-2xl rounded bg-neutral-800">
          4
        </div>

        <button
          :disabled="wordleStore.loading"
          class="px-4 py-2 text-2xl text-green-900 bg-green-300 rounded"
          @click="startGame.classic5Letters"
        >
          Classic 5 letters
        </button>
        <div class="flex items-center justify-center px-4 py-2 text-2xl rounded bg-neutral-800">
          0
        </div>
      </LoadingBox>
    </main>
  </div>
</template>
