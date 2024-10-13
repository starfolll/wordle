<script setup lang="ts">
import PurchaseConfirmation from '@/components/store/PurchaseConfirmation.vue'
import StoreItem from '@/components/store/StoreItem.vue'
import Wallet from '@/components/Wallet.vue'
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
  <main class="grid gap-8">
    <nav class="flex items-center w-full gap-4">
      <button class="w-12 rounded-full bg-neutral-800 aspect-square" @click="router.push('/')">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </button>

      <h1 class="text-xl text-left grow">
        Store
      </h1>

      <Wallet />
    </nav>

    <PurchaseConfirmation v-if="storeStore.purchasingItem" />

    <div class="flex justify-between gap-4">
      <button
        v-for="category in StoreCategories"
        :key="category"
        :disabled="category === activeCategory"
        class="px-4 py-1 text-lg capitalize transition-colors border-2 rounded-full"
        :class="[category === activeCategory
          ? ' bg-transparent border-amber-900 cursor-not-allowed text-amber-400'
          : 'bg-amber-900 text-amber-400 hover:bg-amber-800 border-amber-900 hover:border-amber-800',
        ]"
        @click="() => setActiveCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <div class="grid gap-4">
      <div class="grid grid-cols-3 gap-3">
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

      <hr v-if="activeCategoryAvailableItems.length" class="border-2 border-neutral-800">

      <div class="grid grid-cols-3 gap-3">
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
