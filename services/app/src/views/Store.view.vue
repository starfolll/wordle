<script setup lang="ts">
import CircleButton from '@/components/CircleButton.vue'
import PurchaseConfirmation from '@/components/store/PurchaseConfirmation.vue'
import StoreItem from '@/components/store/StoreItem.vue'
import CoinWallet from '@/components/wallets/CoinWallet.vue'
import DollarWallet from '@/components/wallets/DiamondWallet.vue'
import { useStoreStore } from '@/stores/store/store.store'
import { type AnyStoreItemData, StoreItemCategoryData, type TStoreItemCategoryData } from 'types.app'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const storeStore = useStoreStore()

const activeCategory = ref<keyof TStoreItemCategoryData>('background')
const setActiveCategory = (category: keyof TStoreItemCategoryData) => activeCategory.value = category

const activeCategoryPurchasedItems = computed<AnyStoreItemData[]>(() => {
  return Object.values(storeStore.purchasedItems)
    .filter(item => item.category === activeCategory.value)
    .sort((a, b) => a.name.localeCompare(b.name))
})
const activeCategoryAvailableItems = computed<AnyStoreItemData[]>(() => {
  return storeStore.availableItems
    .filter(item => item.category === activeCategory.value)
    .sort((a, b) => a.name.localeCompare(b.name))
})

const isAffordable = (item: AnyStoreItemData) => storeStore.coins >= item.price
function isItemSelected(item: AnyStoreItemData) {
  if (item.category === StoreItemCategoryData.sticker)
    return

  return storeStore.selectedItems[item.category].id === item.id
}

let itemsAnimationTimeout: number | null = null
const maxAnimationDelayedItems = 9
const isItemsAnimating = ref(true)
const getAnimationDelay = (index: number) => isItemsAnimating.value ? Math.min(index, maxAnimationDelayedItems) * 100 + 100 : 0
function startAnimatingItems() {
  if (itemsAnimationTimeout)
    clearTimeout(itemsAnimationTimeout)

  isItemsAnimating.value = true
  itemsAnimationTimeout = window.setTimeout(
    () => isItemsAnimating.value = false,
    getAnimationDelay(activeCategoryPurchasedItems.value.length + activeCategoryAvailableItems.value.length),
  )
}

watch(activeCategory, startAnimatingItems)

onMounted(() => {
  if (!storeStore.isStoreLoaded)
    storeStore.loadStore()
})
</script>

<template>
  <main class="flex flex-col h-full gap-4">
    <PurchaseConfirmation v-if="storeStore.purchasingItem" />

    <div class="sticky z-10 grid gap-8 p-4 rounded-lg top-4 bg-neutral-900">
      <nav class="flex items-center w-full gap-4">
        <CircleButton @click="router.push('/')">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </CircleButton>

        <h1 class="flex items-center gap-4 text-left grow">
          <font-awesome-icon :icon="['fas', 'store']" size="xl" />
          <span class="text-3xl">Store</span>
        </h1>

        <DollarWallet />
        <CoinWallet />
      </nav>

      <div class="flex justify-between gap-4">
        <button
          v-for="category in StoreItemCategoryData"
          :key="category"
          :disabled="category === activeCategory"
          class="px-4 py-1 text-lg capitalize transition-colors border-2 rounded-full"
          :class="[category === activeCategory
            ? ' bg-transparent border-current-800 cursor-not-allowed text-current-400'
            : 'bg-current-800 text-current-100 hover:bg-current-700 border-current-800 hover:border-current-700',
          ]"
          @click="() => setActiveCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div
      v-if="storeStore.isStoreLoaded"
      class="relative flex flex-col items-start gap-4 pt-4 pb-16 pl-4 pr-2 overflow-x-visible overflow-y-scroll grow"
    >
      <div class="flex items-center w-full gap-4">
        <hr class="border-2 rounded-full grow border-neutral-800">
        <p class="px-2 py-1 text-xl rounded text-current-400 bg-neutral-900">
          Purchased
        </p>
        <hr class="border-2 rounded-full grow border-neutral-800">
      </div>

      <div class="grid w-full grid-cols-3 gap-3">
        <Transition
          v-for="(item, index) in activeCategoryPurchasedItems"
          :key="item.id"
          :style="{ '--animation-delay': `${getAnimationDelay(index)}ms` }"
          appear
          name="fade"
        >
          <button
            :disabled="isItemSelected(item)"
            @click="() => storeStore.setSelectedItem(item)"
          >
            <StoreItem :item="item" hide-price />
          </button>
        </Transition>
      </div>

      <div v-if="activeCategoryAvailableItems.length" class="flex items-center w-full gap-4">
        <hr class="border-2 rounded-full grow border-neutral-800">
        <p class="px-2 py-1 text-xl rounded text-current-400 bg-neutral-900">
          Offers
        </p>
        <hr class="border-2 rounded-full grow border-neutral-800">
      </div>

      <div class="grid w-full grid-cols-3 gap-3">
        <Transition
          v-for="(item, index) in activeCategoryAvailableItems"
          :key="item.id"
          :style="{ '--animation-delay': `${getAnimationDelay(index + activeCategoryPurchasedItems.length)}ms` }"
          appear
          name="fade"
        >
          <button
            :disabled="!isAffordable(item)"
            @click="() => storeStore.setCheckoutItem(item.id)"
          >
            <StoreItem
              :item="item"
              :class="isAffordable(item)
                ? 'cursor-pointer hover:scale-105'
                : 'cursor-not-allowed'
              "
            />
          </button>
        </Transition>
      </div>
    </div>
  </main>
</template>
