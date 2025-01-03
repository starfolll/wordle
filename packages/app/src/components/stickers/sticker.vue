<script lang="ts" setup>
import type { TShopItemStickerData } from 'types'

defineProps<{
  sticker: TShopItemStickerData
}>()
</script>

<template>
  <img
    :src="`/stickers/${sticker.data.stickerUrl}`"
    :alt="sticker.name"
    class="object-contain h-full"
  >
</template>
