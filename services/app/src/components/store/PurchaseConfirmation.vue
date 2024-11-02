<script setup lang="ts">
import { useStoreStore } from '@/stores/store/store.store'
import { vOnClickOutside } from '@vueuse/components'
import StoreItem from './StoreItem.vue'

const storeStore = useStoreStore()
</script>

<template>
  <section v-if="storeStore.purchasingItem" class="fixed top-0 left-0 z-50 grid bg-neutral-900/90 w-dvw h-dvh">
    <div class="flex flex-col items-center justify-center">
      <div
        v-on-click-outside="storeStore.cancelCheckout"
        class="relative grid w-full grid-cols-2 gap-8 p-6 rounded max-w-[400px] backdrop-blur bg-neutral-900/90"
      >
        <StoreItem :item="{ ...storeStore.purchasingItem, price: 0 }" />

        <div class="flex flex-col gap-2">
          <div class="flex justify-between gap-2">
            <p class="text-2xl">
              Checkout
            </p>

            <button
              class="w-10 h-10 rounded-full bg-current-800 hover:bg-current-700"
              @click="storeStore.cancelCheckout"
            >
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <p class="text-current-400">
            Are you sure you want to purchase this
            <span class="text-current-100">{{ storeStore.purchasingItem.category }}</span>?
          </p>

          <p class="text-2xl text-amber-400">
            <span class="text-base text-current-400">for</span>
            {{ storeStore.purchasingItem.price }}
            <font-awesome-icon :icon="['fas', 'coins']" />
          </p>
        </div>

        <button
          class="py-2 font-bold transition-colors border-2 rounded-lg border-rose-400 text-rose-400 hover:bg-rose-900"
          @click="storeStore.cancelCheckout"
        >
          Cancel
        </button>

        <button
          class="py-2 font-bold transition-colors rounded-lg bg-lime-300 text-lime-900 hover:bg-lime-500"
          @click="storeStore.purchaseItem"
        >
          Purchase
        </button>
      </div>
    </div>
  </section>
</template>
