<script setup lang="ts">
import { vBounce } from '@/directives/animations/v-bounce'

defineProps<{
  streak: number
}>()
</script>

<template>
  <section class="relative flex items-center self-center gap-2 px-4 py-1 text-white rounded bg-neutral-900">
    <span
      v-bounce="streak"
      :class="streak === 0 ? 'text-neutral-700' : 'text-white'"
    >
      {{ streak }}
    </span>

    <font-awesome-icon
      v-bounce="streak"
      :class="streak === 0 ? 'text-neutral-700' : 'text-white'"
      :icon="['fas', streak < 10 ? 'fire-flame-simple' : 'fire']"
    />

    <div v-if="streak > 0" class="absolute top-0 left-0 w-full h-full rounded bg-gradient-to-t from-purple-400 via-red-500 to-yellow-400 mix-blend-darken" />
  </section>
</template>
