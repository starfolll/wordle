<script lang="ts" setup>
import { useShopStore } from '@/stores/shop/shop.store'

const shopStore = useShopStore()
</script>

<template>
  <div class="flex items-center h-12 gap-2 px-4 text-xl font-bold border-2 rounded-full bg-neutral-900 border-amber-400 text-amber-400">
    {{ shopStore.coins }}
    <font-awesome-icon :icon="['fas', 'coins']" />
  </div>
</template>
