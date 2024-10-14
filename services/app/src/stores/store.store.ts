import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import { allStoreItems } from './allStoreItems'

export const StoreCategories = {
  background: 'background',
  theme: 'theme',
  font: 'font',
  // button: 'button',
} as const
export type TSoreCategory = typeof StoreCategories

export interface TStoreItemBackground {
  category: TSoreCategory['background']
  background: string
}
export interface TStoreItemTheme {
  category: TSoreCategory['theme']
  themeVariables: Record<string, string>
}
export interface TStoreItemFont {
  category: TSoreCategory['font']
  fontUrl: string
  fontName: string
}

export type TStoreItem = {
  id: string
  name: string
  price: number
  purchased: boolean
  subCategory?: string
} & (TStoreItemBackground | TStoreItemTheme | TStoreItemFont)

export const useStoreStore = defineStore('store', () => {
  const coins = ref(14)

  const allItemsArray = computed(() => Object.values(allStoreItems.value))

  const purchasedItems = computed(() => allItemsArray.value.filter(item => item.purchased))
  const availableItems = computed(() => allItemsArray.value.filter(item => !item.purchased))

  const purchasingItem = ref<TStoreItem | null>(null)
  function selectPurchasingItem(item: TStoreItem) {
    purchasingItem.value = item
  }
  function purchaseItem(): TStoreItem | null {
    if (!purchasingItem.value)
      return null

    const item = purchasingItem.value

    allStoreItems.value[item.id].purchased = true
    coins.value -= item.price
    purchasingItem.value = null

    return item
  }
  function cancelPurchase() {
    purchasingItem.value = null
  }

  return {
    coins,

    allItems: allStoreItems,
    purchasedItems,
    availableItems,

    purchasingItem: readonly(purchasingItem),
    selectPurchasingItem,
    purchaseItem,
    cancelPurchase,
  }
})
