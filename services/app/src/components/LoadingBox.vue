<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()
</script>

<template>
  <div class="relative">
    <slot :class="{ 'pointer-events-none': loading }" />

    <div
      v-if="loading"
      class="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-900/80"
    >
      <font-awesome-icon class="text-green-400 spin" :icon="['fas', 'circle-notch']" size="2xl" />
    </div>
  </div>
</template>
