<script setup lang="ts">
import type { StoreItemStickerData } from 'types.app'
import Sticker from '../stickers/Sticker.vue'

defineProps<{
  item: StoreItemStickerData
}>()
</script>

<template>
  <div class="relative p-4 justify-items-center size-full">
    <Sticker :sticker="item" />
  </div>
</template>
