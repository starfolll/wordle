<script setup lang="ts">
import { vBounce } from '@/directives/animations/v-bounce'
import { useWordleStore } from '@/stores/wordle.store'
import { computed } from 'vue'

const wordleStore = useWordleStore()

const maxSteak = 60
const streak = computed(() => wordleStore.streak)
const streakFillPercentage = computed(() => (streak.value / maxSteak) * 100)
</script>

<template>
  <section class="flex items-center gap-2">
    <p
      v-bounce="streak"
      class="font-mono text-xl"
    >
      {{ streak }}
    </p>

    <div
      class="relative grid w-full"
      :style="{ '--streak-fill-percentage': `clamp(0, ${streakFillPercentage}, 100)` }"
    >
      <div class="flex items-center justify-between w-full gap-1">
        <div class="h-6 aspect-square" />

        <template v-for="i in 6" :key="i">
          <div class="h-1 bg-white rounded-full grow" />
          <div class="h-6 aspect-square" />
        </template>
      </div>

      <div class="absolute top-0 right-0 h-full col-start-1 col-end-6 grayscaleOverlay mix-blend-darken bg-neutral-800" />

      <div class="absolute top-0 left-0 flex items-center justify-between w-full gap-1">
        <font-awesome-icon
          :class="{ 'text-neutral-800': streak === 0 }"
          class="h-6 aspect-square"
          :icon="['fas', 'fire']"
        />

        <template v-for="i in 6" :key="i">
          <div class="grow" />
          <font-awesome-icon
            :class="{ 'text-neutral-800': i * 10 > streak }"
            class="h-6 aspect-square"
            :icon="['fas', 'fire']"
          />
        </template>
      </div>

      <div class="absolute top-0 left-0 w-full h-full col-start-1 col-end-6 mix-blend-darken bg-gradient-to-r from-indigo-500 via-red-500 to-orange-400" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.grayscaleOverlay {
  width: calc(100% - var(--streak-fill-percentage) * 1%);
}
</style>
