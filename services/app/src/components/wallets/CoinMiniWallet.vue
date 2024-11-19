<script lang="ts" setup>
import { vBounce } from '@/directives/animations/v-bounce'
import { useStoreStore } from '@/stores/store/store.store'

const storeStore = useStoreStore()
</script>

<template>
  <span
    v-bounce="storeStore.coins"
    class="px-4 py-1 font-bold rounded text-amber-400 bg-neutral-900"
  >
    {{ storeStore.coins }}
    <font-awesome-icon :icon="['fas', 'coins']" />
  </span>
</template>
