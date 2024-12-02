<script setup lang="ts">
import { usePlacedStickersStore } from '@/stores/placed-stickers.store'
import { computed, ref } from 'vue'

const placedStickersStore = usePlacedStickersStore()

const editingControlsRef = ref<HTMLElement>()

const highlightedStickerPlacement = computed(() => {
  return placedStickersStore.highlightedStickerPlacementId
    ? placedStickersStore.placedStickers[placedStickersStore.highlightedStickerPlacementId]
    : null
})
</script>

<template>
  <div
    v-if="highlightedStickerPlacement"
    ref="editingControlsRef" class="fixed border-2 rounded-lg animate-pulse bg-neutral-300/30 border-neutral-300"
    :style="{
      width: `calc(5rem * ${highlightedStickerPlacement.scale} + 0.5rem)`,
      height: `calc(5rem * ${highlightedStickerPlacement.scale} + 0.5rem)`,
      top: `${highlightedStickerPlacement.y}%`,
      left: `${highlightedStickerPlacement.x}%`,
      transform: ` translate(-50%, -50%) rotate(${highlightedStickerPlacement.rotation}deg)`,
    }"
  />
</template>
