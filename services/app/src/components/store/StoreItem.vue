<script setup lang="ts">
import { type TStoreItem, useStoreStore } from '@/stores/store.store'
import { useThemeStore } from '@/stores/theme.store'
import { computed } from 'vue'
import StoreBackgroundItem from './StoreBackgroundItem.vue'
import StoreFontItem from './StoreFontItem.vue'

const props = defineProps<{
  item: TStoreItem
  hidePrice?: boolean
}>()

const bankStore = useStoreStore()
const themeStore = useThemeStore()

const affordable = computed(() => bankStore.coins >= props.item.price)
const isChosen = computed(() => themeStore.chosenItemsIds.has(props.item.id))
</script>

<template>
  <div class="relative flex flex-col h-full overflow-hidden text-left transition-transform rounded-lg">
    <div
      v-if="isChosen"
      class="absolute top-0 right-0 py-0.5 px-2 text-green-400 rounded-bl-lg bg-neutral-800"
    >
      <font-awesome-icon :icon="['fas', 'circle-check']" />
    </div>

    <div class="w-full h-auto overflow-hidden aspect-square bg-neutral-400">
      <StoreBackgroundItem v-if="item.category === 'background'" :item="item" />
      <StoreFontItem v-else-if="item.category === 'font'" :item="item" />
    </div>

    <div
      class="flex flex-col p-2 grow bg-neutral-800"
      :class="{
        'opacity-50': !affordable && !item.purchased,
      }"
    >
      <h2 class="font-bold">
        {{ item.name }}
      </h2>

      <h3 class="text-sm text-neutral-400">
        {{ item.subCategory }}
      </h3>

      <p v-if="!hidePrice && item.price" class="mt-2 font-bold text-amber-400">
        {{ item.price }}
        <font-awesome-icon :icon="['fas', 'coins']" />
      </p>
    </div>
  </div>
</template>
