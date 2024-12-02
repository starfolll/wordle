<script setup lang="ts">
import { useGamesProgressStore } from '@/stores/gamesProgress.store'
import DailyChallengePlayButton from './daily-challenge-play-button.vue'

defineProps<{
  startDailyChallenge: (date: string) => void
}>()

const gamesProgressStore = useGamesProgressStore()
</script>

<template>
  <div class="flex justify-between w-full gap-1 font-mono">
    <DailyChallengePlayButton
      v-for="(gameProgress, date) in gamesProgressStore.dailyChallenges"
      :key="date"
      :game-progress="gameProgress"
      :date="date"
      @click="startDailyChallenge(date)"
    />
  </div>
</template>
