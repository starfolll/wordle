<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <div
    v-bind="{ ...attrs, class: null }"
    :class="twMerge([
      'py-2 font-mono text-3xl uppercase rounded w-8 text-center aspect-square bg-current-800',
      attrs.class as string ?? '',
    ])"
  >
    <slot />
  </div>
</template>
