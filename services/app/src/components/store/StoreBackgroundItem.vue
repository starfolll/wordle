<script setup lang="ts">
import type { TStoreItemBackground } from '@/stores/store.store'
import { computed, type StyleValue } from 'vue'

const props = defineProps<{
  item: TStoreItemBackground
}>()

const styles = computed<StyleValue>(() => {
  if (props.item.category === 'background') {
    return { background: props.item.background }
  }

  return ''
})
</script>

<template>
  <div class="w-full h-full" :style="styles" />
</template>
