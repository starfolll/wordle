<script lang="ts" setup>
import { useStoreStore } from '@/stores/store/store.store'

const storeStore = useStoreStore()
</script>

<template>
  <div class="flex items-center h-12 gap-2 px-4 text-xl font-bold border-2 rounded-full bg-neutral-900 border-amber-400 text-amber-400">
    {{ storeStore.coins }}
    <font-awesome-icon :icon="['fas', 'coins']" />
  </div>
</template>
