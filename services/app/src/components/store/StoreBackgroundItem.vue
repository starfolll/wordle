<script setup lang="ts">
import type { TStoreItemBackground } from '@/stores/store.store'
import { computed, type StyleValue } from 'vue'

const props = defineProps<{
  item: TStoreItemBackground
}>()

const styles = computed<StyleValue>(() => {
  if (props.item.backgroundCategory === 'color') {
    return { background: props.item.color }
  }

  return ''
})
</script>

<template>
  <div class="w-full h-full" :style="styles" />
</template>
