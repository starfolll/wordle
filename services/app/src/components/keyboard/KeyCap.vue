<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

defineProps<{
  twClass?: string
}>()
</script>

<template>
  <div
    :class="twMerge([
      'px-2 py-2 font-mono text-3xl uppercase rounded w-min aspect-square bg-current-800',
      twClass,
    ])"
  >
    <slot />
  </div>
</template>
