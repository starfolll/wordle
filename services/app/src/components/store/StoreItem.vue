<script setup lang="ts">
import { useStoreStore } from '@/stores/store/store.store'
import { type AnyStoreItemData, StoreItemCategoryData } from 'types.app'
import { computed } from 'vue'
import StoreBackgroundItem from './StoreBackgroundItem.vue'
import StoreFontItem from './StoreFontItem.vue'
import StoreThemeItem from './StoreThemeItem.vue'

const props = defineProps<{
  item: AnyStoreItemData
  hidePrice?: boolean
}>()

const storeStore = useStoreStore()

const affordable = computed(() => storeStore.coins >= props.item.price)
const isChosen = computed(() => {
  if (props.item.category === StoreItemCategoryData.sticker)
    return

  return storeStore.selectedItems[props.item.category].id === props.item.id
})
</script>

<template>
  <div class="relative flex flex-col h-full overflow-hidden text-left transition-transform rounded-lg">
    <div
      v-if="isChosen"
      class="absolute top-0 right-0 py-0.5 px-2 text-green-400 rounded-bl-lg bg-neutral-800"
    >
      <font-awesome-icon :icon="['fas', 'circle-check']" />
    </div>

    <div class="w-full h-auto overflow-hidden border-b-2 aspect-square bg-neutral-800 border-neutral-700">
      <StoreBackgroundItem v-if="item.category === StoreItemCategoryData.background" :item="item" />
      <StoreThemeItem v-else-if="item.category === StoreItemCategoryData.theme" :item="item" />
      <StoreFontItem v-else-if="item.category === StoreItemCategoryData.font" :item="item" />
    </div>

    <div class="flex flex-col p-2 grow bg-neutral-800">
      <div :class="{ 'opacity-50': !affordable }">
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
  </div>
</template>
