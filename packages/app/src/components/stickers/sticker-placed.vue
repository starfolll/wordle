<script setup lang="ts">
import type { TPlacedSticker } from '@/stores/placed-stickers/placed-stickers-storage'
import type { TShopItemStickerData } from 'types.app'
import Sticker from './sticker.vue'

defineProps<{
  placement: TPlacedSticker
  sticker: TShopItemStickerData
}>()
</script>

<template>
  <Sticker
    :sticker="sticker"
    class="fixed stickerPlaced"
    :style="{
      'width': `calc(5rem * ${placement.scale})`,
      'height': `calc(5rem * ${placement.scale})`,
      '--sticker-placement-top': placement.y,
      '--sticker-placement-left': placement.x,
      '--sticker-placement-rotation': placement.rotation,
    }"
  />
</template>

<style lang="scss">
.stickerPlaced {
  top: calc((
    var(--sticker-placement-top) * (1 - var(--is-editing-sticker, 0))
    + var(--sticker-editing-placement-top, 0) * var(--is-editing-sticker, 0)
  ) * 1%);

  left: calc((
    var(--sticker-placement-left) * (1 - var(--is-editing-sticker, 0))
    + var(--sticker-editing-placement-left, 0) * var(--is-editing-sticker, 0)
  ) * 1%);

  translate: -50% -50%;

  rotate: calc(var(--sticker-placement-rotation) * 1deg);
}
</style>
