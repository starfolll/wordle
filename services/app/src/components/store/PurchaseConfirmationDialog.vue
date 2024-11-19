<script setup lang="ts">
import { useStoreStore } from '@/stores/store/store.store'
import { vOnClickOutside } from '@vueuse/components'
import { ref, watch } from 'vue'
import Dialog from '../Dialog.vue'
import StoreItem from './StoreItem.vue'

const storeStore = useStoreStore()

const dialogRef = ref<InstanceType<typeof Dialog>>()

const cachedPurchasingItem = ref(storeStore.purchasingItem)

watch(() => storeStore.purchasingItem, (item) => {
  if (item) {
    dialogRef.value?.openDialog()
    cachedPurchasingItem.value = item
  }
  else {
    dialogRef.value?.closeDialog()
  }
})
</script>

<template>
  <Dialog ref="dialogRef" :show-title="false">
    <div v-if="cachedPurchasingItem" class="flex flex-col items-center justify-center">
      <div
        v-on-click-outside="storeStore.cancelCheckout"
        class="relative grid w-full grid-cols-2 rounded gap-x-4 gap-y-8 backdrop-blur bg-neutral-900/90"
      >
        <StoreItem
          :purchased="true"
          :item="cachedPurchasingItem"
        />

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xl">
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
            <span class="text-current-100">{{ cachedPurchasingItem.category }}</span>?
          </p>

          <p class="flex items-end gap-2 text-2xl font-bold text-amber-400">
            <span class="text-base text-current-400">for</span>

            <span v-if="cachedPurchasingItem.price">
              {{ cachedPurchasingItem.price }}
              <font-awesome-icon :icon="['fas', 'coins']" />
            </span>
            <span v-else class="font-bold animate-pulse">
              Free!
            </span>
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
  </Dialog>
</template>
