<script setup lang="ts">
import CircleButton from '@/components/CircleButton.vue'
import PurchaseConfirmationDialog from '@/components/store/PurchaseConfirmationDialog.vue'
import StoreItem from '@/components/store/StoreItem.vue'
import CoinWallet from '@/components/wallets/CoinWallet.vue'
import DollarWallet from '@/components/wallets/DiamondWallet.vue'
import { useStoreStore } from '@/stores/store/store.store'
import { type AnyStoreItemData, StoreItemCategoryData, type TStoreItemCategoryData } from 'types.app'
import { computed, onMounted, ref, watch } from 'vue'
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
  <main class="flex flex-col h-full p-2 pb-0 backdrop-blur">
    <PurchaseConfirmationDialog />

    <section class="sticky z-10 grid gap-8 p-4 rounded-t-lg bg-neutral-900">
      <nav class="flex items-center w-full gap-4">
        <CircleButton @click="router.push('/')">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </CircleButton>

        <h1 class="flex items-center gap-4 text-left grow">
          <font-awesome-icon :icon="['fas', 'store']" size="xl" />
        </h1>

        <DollarWallet />
        <CoinWallet />
      </nav>

      <div class="flex flex-wrap justify-between gap-4">
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
    </section>

    <section
      v-if="storeStore.isStoreLoaded"
      class="flex flex-col items-start gap-4 pt-4 pb-16 overflow-x-visible overflow-y-scroll scrollbar-width-0 grow"
    >
      <button
        v-if="activeCategory === StoreItemCategoryData.sticker"
        class="p-2 px-4 m-auto mt-8 mb-8 text-lg font-semibold rounded-full text-balance text-current-200 bg-current-800 disabled:opacity-50"
        :disabled="activeCategoryPurchasedItems.length === 0"
        @click="router.push('/stickers-editor')"
      >
        <font-awesome-icon :icon="['fas', 'pen']" class="mr-2" />
        Edit background stickers
      </button>

      <div class="w-full p-2 pl-4 text-xl rounded-lg text-current-400 bg-neutral-900">
        <div v-if="activeCategoryPurchasedItems.length === 0">
          You don't have any purchased {{ activeCategory }}
        </div>
        <span v-else>
          Your Items
        </span>
      </div>

      <div
        v-if="activeCategoryPurchasedItems.length !== 0"
        class="grid w-full grid-cols-3 gap-2"
      >
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
            <StoreItem :item="item" purchased />
          </button>
        </Transition>
      </div>

      <div
        v-if="activeCategoryAvailableItems.length"
        class="w-full p-2 pl-4 mt-8 text-xl rounded-lg text-current-400 bg-neutral-900"
      >
        Available Store Items
      </div>

      <div class="grid w-full grid-cols-3 gap-2">
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
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
              "
            />
          </button>
        </Transition>
      </div>
    </section>
  </main>
</template>
