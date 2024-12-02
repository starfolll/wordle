<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'

defineProps<{
  twClass?: string
}>()

const container = ref<HTMLDivElement | null>(null)

defineExpose({ container })
</script>

<template>
  <div
    ref="container"
    :class="[twMerge(
      'grid items-center transition-colors duration-500 justify-center text-3xl font-bold uppercase rounded w-14 aspect-square bg-neutral-800',
      twClass,
    )]"
  >
    <slot />
  </div>
</template>
