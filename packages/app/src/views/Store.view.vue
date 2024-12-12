<script setup lang="ts">
import PurchaseConfirmation from '@/components/shop/purchase-confirmation.vue'
import ShopItem from '@/components/shop/shop-item.vue'
import ButtonBase from '@/components/ui/buttons/button-base.vue'
import ButtonCircle from '@/components/ui/buttons/button-circle.vue'
import ButtonToggle from '@/components/ui/buttons/button-toggle.vue'
import WalletCoin from '@/components/wallets/wallet-coin.vue'
import WalletDiamond from '@/components/wallets/wallet-diamond.vue'
import { useShopStore } from '@/stores/shop/shop.store'
import { ShopItemCategoryData, type TAnyShopItemData, type TShopItemCategoryData } from 'types.app'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const shopStore = useShopStore()

const activeCategory = ref<keyof TShopItemCategoryData>('background')

const activeCategoryPurchasedItems = computed<TAnyShopItemData[]>(() => {
  return Object.values(shopStore.purchasedItems)
    .filter(item => item.category === activeCategory.value)
    .sort((a, b) => a.name.localeCompare(b.name))
})
const activeCategoryAvailableItems = computed<TAnyShopItemData[]>(() => {
  return shopStore.availableItems
    .filter(item => item.category === activeCategory.value)
    .sort((a, b) => a.name.localeCompare(b.name))
})

const isAffordable = (item: TAnyShopItemData) => shopStore.coins >= item.price
function isItemSelected(item: TAnyShopItemData) {
  if (item.category === ShopItemCategoryData.sticker)
    return

  return shopStore.selectedItems[item.category].id === item.id
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
  if (!shopStore.isShopLoaded)
    shopStore.loadShop()
})
</script>

<template>
  <main class="flex flex-col h-full p-2 pb-0 backdrop-blur">
    <PurchaseConfirmation />

    <section class="sticky z-10 grid gap-8 p-4 rounded-t-lg bg-neutral-900">
      <nav class="flex items-center w-full gap-4">
        <ButtonCircle @click="router.push('/')">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </ButtonCircle>

        <h1 class="flex items-center gap-4 text-left grow">
          <font-awesome-icon :icon="['fas', 'store']" size="xl" />
        </h1>

        <WalletDiamond />
        <WalletCoin />
      </nav>

      <div class="flex flex-wrap justify-between gap-4">
        <ButtonToggle
          v-for="category in ShopItemCategoryData"
          :key="category"
          v-model="activeCategory"
          :value="category"
          class="capitalize"
        >
          {{ category }}
        </ButtonToggle>
      </div>
    </section>

    <section
      v-if="shopStore.isShopLoaded"
      class="flex flex-col items-start gap-4 pt-4 pb-16 overflow-x-visible overflow-y-scroll scrollbar-width-0 grow"
    >
      <ButtonBase
        v-if="activeCategory === ShopItemCategoryData.sticker"
        class="p-2 px-4 m-auto mt-8 mb-8 text-lg font-semibold rounded-full text-balance text-current-200 bg-current-800 disabled:opacity-50"
        :disabled="activeCategoryPurchasedItems.length === 0"
        @click="router.push('/stickers-editor')"
      >
        <font-awesome-icon :icon="['fas', 'pen']" class="mr-2" />
        Edit background stickers
      </ButtonBase>

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
          <ButtonBase
            :disabled="isItemSelected(item)"
            @click="() => shopStore.setSelectedItem(item)"
          >
            <ShopItem :item="item" purchased />
          </ButtonBase>
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
          <ButtonBase
            :disabled="!isAffordable(item)"
            @click="() => shopStore.setCheckoutItem(item.id)"
          >
            <ShopItem
              :item="item"
              :class="isAffordable(item)
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
              "
            />
          </ButtonBase>
        </Transition>
      </div>
    </section>
  </main>
</template>
