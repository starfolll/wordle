<script lang="ts" setup>
import { useStoreStore } from '@/stores/store.store'

const bankStore = useStoreStore()
</script>

<template>
  <div class="flex items-center h-12 gap-2 px-4 text-xl font-bold border-2 rounded-full bg-neutral-900 border-emerald-400 text-emerald-400">
    {{ bankStore.dollars }}
    <font-awesome-icon :icon="['fas', 'dollar-sign']" />
  </div>
</template>
