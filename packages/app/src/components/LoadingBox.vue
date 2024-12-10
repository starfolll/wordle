<script setup lang="ts">
import { h } from 'vue'

const props = defineProps<{
  is?: string
  loading?: boolean
}>()

const container = h(props.is ?? 'div')
</script>

<template>
  <component :is="container" class="relative">
    <slot :class="{ 'pointer-events-none': loading }" />

    <div
      v-if="loading"
      class="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-current-900/80"
    >
      <font-awesome-icon class="text-green-400 spin" :icon="['fas', 'circle-notch']" size="2xl" />
    </div>
  </component>
</template>
