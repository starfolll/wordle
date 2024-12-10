<script setup lang="ts">
import { usePlacedStickersStore } from '@/stores/placed-stickers/placed-stickers.store'
import { vOnClickOutside } from '@vueuse/components'
import { useThrottleFn } from '@vueuse/core'
import { computed, onBeforeUnmount, ref } from 'vue'

const placedStickersStore = usePlacedStickersStore()

const editingControlsRef = ref<HTMLElement>()

const editingStickerPlacement = computed(() => {
  return placedStickersStore.editingStickerPlacementId
    ? placedStickersStore.placedStickers[placedStickersStore.editingStickerPlacementId]
    : null
})
const editingStickerElementRef = computed(() => {
  if (editingStickerPlacement.value === null)
    return null

  const editingStickerPlacementIndex = placedStickersStore.placedStickersArray.findIndex(({ placementId }) => placementId === editingStickerPlacement.value?.placementId)

  if (editingStickerPlacementIndex === null)
    return null

  return placedStickersStore.placedStickersContainerRef?.children[editingStickerPlacementIndex] as HTMLElement
    ?? null
})

const touchOffset = ref<null | {
  top: number
  left: number
}>(null)
const stickerEditingPlacement = ref<null | {
  top: string
  left: string
}>(null)

function setTouchOffset(e: TouchEvent) {
  const elementRect = editingControlsRef.value!.getBoundingClientRect()
  touchOffset.value = {
    left: e.touches[0].clientX - elementRect.left - elementRect.width / 2,
    top: e.touches[0].clientY - elementRect.top - elementRect.height / 2,
  }
}

const handleMove = useThrottleFn((e: TouchEvent) => {
  if (!editingStickerElementRef.value || !touchOffset.value)
    return

  const top = ((e.touches[0].clientY - touchOffset.value.top) / window.innerHeight * 100).toString()
  const left = ((e.touches[0].clientX - touchOffset.value.left) / window.innerWidth * 100).toString()

  stickerEditingPlacement.value = { top, left }

  editingStickerElementRef.value.style.setProperty('--is-editing-sticker', '1')
  editingStickerElementRef.value.style.setProperty('--sticker-editing-placement-top', top)
  editingStickerElementRef.value.style.setProperty('--sticker-editing-placement-left', left)
}, 5)

function stopEditing() {
  placedStickersStore.editingStickerPlacementId
  && stickerEditingPlacement.value
  && placedStickersStore.updateStickerPlacement(placedStickersStore.editingStickerPlacementId, {
    x: Number.parseFloat(stickerEditingPlacement.value.left),
    y: Number.parseFloat(stickerEditingPlacement.value.top),
  })

  stickerEditingPlacement.value = null

  editingStickerElementRef.value?.style.removeProperty('--is-editing-sticker')
  editingStickerElementRef.value?.style.removeProperty('--sticker-editing-placement-top')
  editingStickerElementRef.value?.style.removeProperty('--sticker-editing-placement-left')

  placedStickersStore.setEditingStickerPlacementId(null)
}

onBeforeUnmount(stopEditing)
</script>

<template>
  <div
    v-if="editingStickerPlacement" ref="editingControlsRef"
    v-on-click-outside="stopEditing"
    class="fixed border-2 border-green-400 rounded-lg stickerPlaced animate-pulse bg-green-400/30"
    :style="{
      'width': `calc(5rem * ${editingStickerPlacement.scale} + 0.5rem)`,
      'height': `calc(5rem * ${editingStickerPlacement.scale} + 0.5rem)`,
      '--sticker-placement-top': editingStickerPlacement.y,
      '--sticker-placement-left': editingStickerPlacement.x,
      '--sticker-placement-rotation': editingStickerPlacement.rotation,

      '--is-editing-sticker': stickerEditingPlacement === null ? 0 : 1,
      '--sticker-editing-placement-top': stickerEditingPlacement ? stickerEditingPlacement.top : 0,
      '--sticker-editing-placement-left': stickerEditingPlacement ? stickerEditingPlacement.left : 0,
    }"
    @touchstart="setTouchOffset"
    @touchmove="handleMove"
  />
</template>
