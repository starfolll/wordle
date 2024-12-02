<script setup lang="ts">
import type { TShopItemBackgroundData } from 'types.app'
import { computed, type StyleValue } from 'vue'

const props = defineProps<{
  item: TShopItemBackgroundData
}>()

const styles = computed<StyleValue>(() => {
  if (props.item.category === 'background') {
    return { background: props.item.data.background }
  }

  return ''
})
</script>

<template>
  <div class="w-full h-full" :style="styles" />
</template>
