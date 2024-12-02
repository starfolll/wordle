<script setup lang="ts">
import type { ShopItemStickerData } from 'types.app'
import Sticker from '../stickers/sticker.vue'

defineProps<{
  item: ShopItemStickerData
}>()
</script>

<template>
  <div class="relative p-4 justify-items-center size-full">
    <Sticker :sticker="item" />
  </div>
</template>
