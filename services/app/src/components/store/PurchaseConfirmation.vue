<script setup lang="ts">
import { useStoreStore } from '@/stores/store.store'
import { useThemeStore } from '@/stores/theme.store'
import { vOnClickOutside } from '@vueuse/components'
import StoreItem from './StoreItem.vue'

const storeStore = useStoreStore()
const themeStore = useThemeStore()

function purchaseItem() {
  const item = storeStore.purchaseItem()

  if (item)
    themeStore.setChosenItem(item)
}
</script>

<template>
  <section v-if="storeStore.purchasingItem" class="fixed top-0 left-0 z-10 grid bg-neutral-900/70 w-dvw h-dvh">
    <div class="flex flex-col items-center justify-center">
      <div
        v-on-click-outside="storeStore.cancelPurchase"
        class="relative grid w-full grid-cols-2 gap-4 p-6 border-2 rounded max-w-96 backdrop-blur border-neutral-800 bg-neutral-900/90"
      >
        <StoreItem :item="{ ...storeStore.purchasingItem, price: 0 }" />

        <div class="flex flex-col gap-2">
          <div class="flex justify-between gap-2">
            <p class="text-2xl">
              Checkout
            </p>

            <button
              class="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700"
              @click="storeStore.cancelPurchase"
            >
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <p class="text-neutral-400">
            Are you sure you want to purchase this
            <span class="text-neutral-100">{{ storeStore.purchasingItem.category }}</span>?
          </p>

          <p class="text-2xl text-amber-400">
            <span class="text-base text-neutral-400">for</span>
            {{ storeStore.purchasingItem.price }}
            <font-awesome-icon :icon="['fas', 'dollar-sign']" />
          </p>
        </div>

        <button
          class="py-2 font-bold transition-colors border-2 rounded-lg border-rose-400 text-rose-400 hover:bg-rose-900"
          @click="storeStore.cancelPurchase"
        >
          Cancel
        </button>

        <button
          class="py-2 font-bold transition-colors rounded-lg bg-lime-300 text-lime-900 hover:bg-lime-500"
          @click="purchaseItem"
        >
          Purchase
        </button>
      </div>
    </div>
  </section>
</template>
