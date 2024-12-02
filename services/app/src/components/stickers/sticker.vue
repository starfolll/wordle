<script lang="ts" setup>
import type { TShopItemStickerData } from 'types.app'

defineProps<{
  sticker: TShopItemStickerData
}>()
</script>

<template>
  <img
    :src="`/stickers/${sticker.data.stickerUrl}.png`"
    :alt="sticker.name"
    class="object-contain h-full"
  >
</template>
