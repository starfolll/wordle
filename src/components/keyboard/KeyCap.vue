<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { defineProps } from 'vue'

defineProps<{
  twClass?: string
}>()
</script>

<template>
  <div
    :class="twMerge([
      'px-2 py-2 font-mono text-3xl uppercase rounded w-min aspect-square bg-neutral-800',
      twClass,
    ])"
  >
    <slot />
  </div>
</template>
