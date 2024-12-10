<script lang="ts" setup>
import { vBounce } from '@/directives/animations/v-bounce'
import { useShopStore } from '@/stores/shop/shop.store'

const shopStore = useShopStore()
</script>

<template>
  <span
    v-bounce="shopStore.coins"
    class="px-4 py-1 font-bold rounded text-amber-400 bg-neutral-900"
  >
    {{ shopStore.coins }}
    <font-awesome-icon :icon="['fas', 'coins']" />
  </span>
</template>
