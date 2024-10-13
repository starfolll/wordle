import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const StoreCategories = {
  background: 'background',
  font: 'font',
  // button: 'button',
} as const
export type TSoreCategory = typeof StoreCategories

export interface TStoreItemBackground {
  category: TSoreCategory['background']
  background: string
}
export interface TStoreItemFont {
  category: TSoreCategory['font']
  fontUrl: string
  fontName: string
}

export type TStoreItem = {
  id: number
  name: string
  price: number
  purchased: boolean
  subCategory?: string
} & (TStoreItemBackground | TStoreItemFont)

export const useStoreStore = defineStore('store', () => {
  const coins = ref(100)

  // wordle store categories:
  //
  // - backgrounds
  // - - colors (gradients)
  // - - icons on background
  //
  // - global font
  //
  // - buttons details
  // - - border details (leaves on border, start on border, etc)
  // - - click animations

  const allItems = ref<Record<TStoreItem['id'], TStoreItem>>({
    1: {
      id: 1,
      name: 'Default',
      price: 0,
      category: 'background',
      purchased: true,
      background: '#171717',
    },
    2: {
      id: 2,
      name: 'Fall',
      price: 10,
      category: 'background',
      subCategory: '4 seasons',
      purchased: false,
      background: 'linear-gradient(to left top, #e9b91c, #ae1324)',
    },
    3: {
      id: 3,
      name: 'Winter',
      price: 10,
      category: 'background',
      subCategory: '4 seasons',
      purchased: false,
      background: 'linear-gradient(to left top, #E6DADA, #272846)',
    },
    4: {
      id: 4,
      name: 'Spring',
      price: 10,
      category: 'background',
      subCategory: '4 seasons',
      purchased: false,
      background: `linear-gradient(to left top, #fad0c4, #fad0c4, #ffd1ff)`,
    },
    5: {
      id: 5,
      name: 'Summer',
      price: 10,
      category: 'background',
      subCategory: '4 seasons',
      purchased: false,
      background: 'linear-gradient(to left top, #22c1c3, #fdbb2d)',
    },
    6: {
      id: 6,
      name: 'Default',
      price: 10,
      category: 'font',
      purchased: true,
      fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
      fontName: '""',
    },
    7: {
      id: 7,
      name: 'Bubbles',
      price: 10,
      category: 'font',
      subCategory: 'fuzzy',
      purchased: false,
      fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
      fontName: '"Fuzzy Bubbles"',
    },
  })
  const allItemsArray = computed(() => Object.values(allItems.value))

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

    allItems.value[item.id].purchased = true
    coins.value -= item.price
    purchasingItem.value = null

    return item
  }
  function cancelPurchase() {
    purchasingItem.value = null
  }

  return {
    coins,

    allItems,
    purchasedItems,
    availableItems,

    purchasingItem: readonly(purchasingItem),
    selectPurchasingItem,
    purchaseItem,
    cancelPurchase,
  }
})
