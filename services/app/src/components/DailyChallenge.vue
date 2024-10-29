<script setup lang="ts">
import { useGamesProgressStore } from '@/stores/gamesProgress.store'
import { getToday } from 'dates'

defineProps<{
  startDailyChallenge: (date: string) => void
}>()

const gamesProgressStore = useGamesProgressStore()

const today = getToday()

function isToday(dateString: string) {
  const date = new Date(dateString)

  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

function getDateShort(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}
</script>

<template>
  <div class="flex justify-between w-full gap-1 font-mono">
    <button
      v-for="(gameProgress, date) in gamesProgressStore.dailyChallenges"
      :key="date"
      :disabled="!isToday(date)"
      class="flex flex-col items-center gap-2 py-2 transition-colors border-2 rounded-lg grow"
      :class="[
        isToday(date) && !gameProgress?.isCompleted
          ? 'border-current-700 bg-current-700 hover:bg-current-600 hover:border-current-600'
          : 'border-neutral-700 bg-neutral-900',
        isToday(date) || gameProgress?.isCompleted
          ? 'text-current-100'
          : 'text-neutral-600',
      ]"
      @click="startDailyChallenge(date)"
    >
      <p :class="{ 'font-bold': isToday(date) }">
        {{ getDateShort(date) }}
      </p>

      <font-awesome-icon
        v-if="gameProgress?.isCompleted"
        class="size-6 text-current-200"
        :icon="['fas', 'circle-check']"
      />
      <div
        v-else
        class="border-2 border-dashed rounded-full size-6"
        :class="isToday(date) ? 'border-current-100' : 'border-neutral-600'"
      />
    </button>
  </div>
</template>
