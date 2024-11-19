<script setup lang="ts">
import { useStoreStore } from '@/stores/store/store.store'
import { type AnyStoreItemData, StoreItemCategoryData } from 'types.app'
import { computed } from 'vue'
import StoreBackgroundItem from './StoreBackgroundItem.vue'
import StoreFontItem from './StoreFontItem.vue'
import StoreStickerItem from './StoreStickerItem.vue'
import StoreThemeItem from './StoreThemeItem.vue'

const { item, purchased = false } = defineProps<{
  item: AnyStoreItemData
  purchased?: boolean
}>()

const storeStore = useStoreStore()

const affordable = computed(() => storeStore.coins >= item.price)
const isChosen = computed(() => {
  if (item.category === StoreItemCategoryData.sticker)
    return

  return storeStore.selectedItems[item.category].id === item.id
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
      <StoreStickerItem v-else-if="item.category === StoreItemCategoryData.sticker" :item="item" />
    </div>

    <div
      class="flex flex-col gap-2 p-2 grow bg-neutral-800"
      :class="{ 'opacity-50': !affordable && !purchased }"
    >
      <h2 class="mb-auto font-semibold leading-5">
        {{ item.name }}
      </h2>

      <template v-if="!purchased">
        <p v-if="item.price" class="mb-2 font-bold text-amber-400">
          {{ item.price }}
          <font-awesome-icon :icon="['fas', 'coins']" />
        </p>
        <p v-else class="mb-2 font-bold animate-pulse text-amber-300">
          Free!
        </p>
      </template>

      <h3 class="text-sm text-neutral-400">
        {{ item.subCategory }}
      </h3>
    </div>
  </div>
</template>
