<script setup lang="ts">
import type { DailyChallengeGameProgressData } from 'types.app'
import { getDateShort, getToday, isSameDay } from 'dates'
import { computed } from 'vue'

const props = defineProps<{
  gameProgress: DailyChallengeGameProgressData | null
  date: string
}>()

const today = getToday()
const dateShort = computed(() => getDateShort(props.date))

const isActiveDate = computed(() => isSameDay(today, new Date(props.date)))
</script>

<template>
  <button
    :disabled="!isActiveDate"
    class="flex flex-col items-center gap-2 py-2 transition-colors border-2 rounded-lg grow"
    :class="[
      isActiveDate && !gameProgress?.isCompleted
        ? 'border-current-700 bg-current-700 hover:bg-current-600 hover:border-current-600'
        : 'border-neutral-700 bg-neutral-900',
      isActiveDate || gameProgress?.isCompleted
        ? 'text-current-100'
        : 'text-neutral-600',
    ]"
  >
    <p :class="{ 'font-bold': isActiveDate }">
      {{ dateShort }}
    </p>

    <font-awesome-icon
      v-if="gameProgress?.isCompleted"
      class="size-6 text-current-200"
      :icon="['fas', 'circle-check']"
    />
    <div
      v-else
      class="border-2 border-dashed rounded-full size-6"
      :class="isActiveDate ? 'border-current-100' : 'border-neutral-600'"
    />
  </button>
</template>
