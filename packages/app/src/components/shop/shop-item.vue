<script setup lang="ts">
import { useShopStore } from '@/stores/shop/shop.store'
import { ShopItemCategoryData, type TAnyShopItemData } from 'types'
import { computed } from 'vue'
import StoreItemBackground from './shop-background-item.vue'
import StoreItemFont from './shop-item-font.vue'
import StoreItemSticker from './shop-item-sticker.vue'
import StoreItemTheme from './shop-item-theme.vue'

const { item, purchased = false } = defineProps<{
  item: TAnyShopItemData
  purchased?: boolean
}>()

const shopStore = useShopStore()

const affordable = computed(() => shopStore.coins >= item.price)
const isChosen = computed(() => {
  if (item.category === ShopItemCategoryData.sticker)
    return

  return shopStore.selectedItems[item.category].id === item.id
})

const storeItemComponent = {
  [ShopItemCategoryData.background]: StoreItemBackground,
  [ShopItemCategoryData.theme]: StoreItemTheme,
  [ShopItemCategoryData.font]: StoreItemFont,
  [ShopItemCategoryData.sticker]: StoreItemSticker,
} as const satisfies Record<keyof typeof ShopItemCategoryData, any>
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
      <component :is="storeItemComponent[item.category]" :item="(item as any)" />
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
