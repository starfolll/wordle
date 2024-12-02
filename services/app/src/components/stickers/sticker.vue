<script lang="ts" setup>
import type { ShopItemStickerData } from 'types.app'

defineProps<{
  sticker: ShopItemStickerData
}>()
</script>

<template>
  <img
    :src="`/stickers/${sticker.data.stickerUrl}.png`"
    :alt="sticker.name"
    class="object-contain h-full"
  >
</template>
