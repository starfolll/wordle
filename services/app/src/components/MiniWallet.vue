<script lang="ts" setup>
import { vBounce } from '@/directives/animations/v-bounce'
import { useStoreStore } from '@/stores/store.store'

const bankStore = useStoreStore()
</script>

<template>
  <span
    v-bounce="bankStore.coins"
    class="px-4 font-bold text-amber-400"
  >
    {{ bankStore.coins }}
    <font-awesome-icon :icon="['fas', 'coins']" />
  </span>
</template>
