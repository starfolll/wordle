<script setup lang="ts">
defineProps<{
  startDailyChallenge: () => void
}>()

const today = new Date()

function getMonday(date: Date) {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}
const monday = getMonday(new Date())
const daysInWeek = Array.from({ length: 7 }, (_, i) => {
  const nextDay = new Date(monday)
  nextDay.setDate(monday.getDate() + i)
  return nextDay
})

const completedDays = [] as Date[]

function isToday(date: Date) {
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

function isCompleted(date: Date) {
  return completedDays.some(day => day.toDateString() === date.toDateString())
}
</script>

<template>
  <div class="flex justify-between w-full gap-1 font-mono">
    <button
      v-for="dayInWeek in daysInWeek"
      :key="dayInWeek.toDateString()"
      :disabled="!isToday(dayInWeek)"
      class="flex flex-col items-center gap-2 py-2 transition-colors border-2 rounded-lg grow"
      :class="[
        isToday(dayInWeek) && !isCompleted(dayInWeek)
          ? 'border-current-700 bg-current-700 hover:bg-current-600 hover:border-current-600 text-current-100'
          : 'border-neutral-700 text-neutral-600',
      ]"
      @click="startDailyChallenge"
    >
      <p :class="{ 'font-bold': isToday(dayInWeek) }">
        {{ dayInWeek.toLocaleDateString('en-US', { weekday: 'short' }) }}
      </p>

      <font-awesome-icon
        v-if="isCompleted(dayInWeek)"
        class="size-6 text-current-200"
        :icon="['fas', 'circle-check']"
      />
      <div
        v-else
        class="border-2 border-dashed rounded-full size-6"
        :class="isToday(dayInWeek) ? 'border-current-100' : 'border-neutral-600'"
      />
    </button>
  </div>
</template>
