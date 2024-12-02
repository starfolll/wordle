<script lang="ts" setup>
import type { StoreItemStickerData } from 'types.app'

defineProps<{
  sticker: StoreItemStickerData
}>()
</script>

<template>
  <img
    :src="`/stickers/${sticker.data.stickerUrl}.png`"
    :alt="sticker.name"
    class="object-contain h-full"
  >
</template>
