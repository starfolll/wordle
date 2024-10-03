<script setup lang="ts">
import { ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

defineExpose({ container })
</script>

<template>
  <div ref="container" class="grid items-center justify-center text-3xl font-bold uppercase rounded-sm w-14 aspect-square bg-neutral-800">
    <slot />
  </div>
</template>
