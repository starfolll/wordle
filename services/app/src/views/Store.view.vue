<script setup lang="ts">
import { useUserData } from '@/api/useUserData'
import CircleButton from '@/components/CircleButton.vue'
import PurchaseConfirmation from '@/components/store/PurchaseConfirmation.vue'
import StoreItem from '@/components/store/StoreItem.vue'
import CoinWallet from '@/components/wallets/CoinWallet.vue'
import DollarWallet from '@/components/wallets/DollarWallet.vue'
import { StoreCategories, type TSoreCategory, type TStoreItem, useStoreStore } from '@/stores/store.store'
import { useThemeStore } from '@/stores/theme.store'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const storeStore = useStoreStore()
const themeStore = useThemeStore()

const activeCategory = ref<keyof TSoreCategory>(StoreCategories.background)

const activeCategoryPurchasedItems = computed(() => storeStore.purchasedItems.filter(item => item.category === activeCategory.value))
const activeCategoryAvailableItems = computed(() => storeStore.availableItems.filter(item => item.category === activeCategory.value))

const availableToPurchase = (item: TStoreItem) => storeStore.coins >= item.price

const maxAnimationDelayedItems = 9
const isItemsAnimating = ref(true)
const getAnimationDelay = (index: number) => isItemsAnimating.value ? Math.min(index, maxAnimationDelayedItems) * 100 + 100 : 0

function setActiveCategory(category: keyof TSoreCategory) {
  activeCategory.value = category
  isItemsAnimating.value = true
}

const getIsChosen = (item: TStoreItem) => themeStore.chosenItemsIds.has(item.id)

onMounted(() => {
  setTimeout(
    () => isItemsAnimating.value = false,
    getAnimationDelay(activeCategoryPurchasedItems.value.length + activeCategoryAvailableItems.value.length),
  )
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
          v-for="category in StoreCategories"
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

    <div class="relative flex flex-col items-start gap-4 pt-4 pb-16 pl-4 pr-2 overflow-x-visible overflow-y-scroll grow">
      <div class="flex items-center w-full gap-4">
        <hr class="border-2 rounded-full grow border-neutral-800">
        <p class="px-2 py-1 text-xl rounded text-current-400 bg-neutral-900">
          Purchased
        </p>
        <hr class="border-2 rounded-full grow border-neutral-800">
      </div>

      <div class="grid w-full grid-cols-3 gap-3">
        <Transition
          v-for="(item, index) in activeCategoryPurchasedItems" :key="item.name"
          :style="{ '--animation-delay': `${getAnimationDelay(index)}ms` }"
          appear
          name="fade"
        >
          <button
            :disabled="getIsChosen(item)"
            @click="() => themeStore.setChosenItem(item)"
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
          v-for="(item, index) in activeCategoryAvailableItems" :key="item.name"
          :style="{ '--animation-delay': `${getAnimationDelay(index + activeCategoryPurchasedItems.length)}ms` }"
          appear
          name="fade"
        >
          <button
            :disabled="!availableToPurchase(item)"
            @click="() => storeStore.selectPurchasingItem(item)"
          >
            <StoreItem
              :item="item"
              :class="availableToPurchase(item)
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
