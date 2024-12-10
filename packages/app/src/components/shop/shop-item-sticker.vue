<script setup lang="ts">
import type { TShopItemStickerData } from 'types.app'
import Sticker from '../stickers/sticker.vue'

defineProps<{
  item: TShopItemStickerData
}>()
</script>

<template>
  <div class="relative p-4 justify-items-center size-full">
    <Sticker :sticker="item" />
  </div>
</template>
