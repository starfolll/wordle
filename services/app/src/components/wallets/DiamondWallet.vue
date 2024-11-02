<script lang="ts" setup>
import { useStoreStore } from '@/stores/store/store.store'

const storeStore = useStoreStore()
</script>

<template>
  <div class="flex items-center h-12 gap-2 px-4 text-xl font-bold border-2 rounded-full text-sky-300 bg-neutral-900 border-sky-300">
    {{ storeStore.diamonds }}
    <font-awesome-icon :icon="['fas', 'gem']" />
  </div>
</template>
