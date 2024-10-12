import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const StoreCategories = ['background', 'font', 'button'] as const
export type TSoreCategory = {
  [_key in typeof StoreCategories[number]]: Extract<typeof StoreCategories[number], _key>
}

export const StoreBackgroundCategory = ['color', 'gradient', 'image'] as const
export type TStoreBackgroundCategory = {
  [_key in typeof StoreBackgroundCategory[number]]: Extract<typeof StoreBackgroundCategory[number], _key>
}

export type TStoreItemBackground = {
  category: TSoreCategory['background']
} & ({
  backgroundCategory: TStoreBackgroundCategory['color']
  color: string
})
//  | {
//   backgroundCategory: TStoreBackgroundCategory['gradient']
//   gradient: string
// } | {
//   backgroundCategory: TStoreBackgroundCategory['image']
//   image: string
// })

export type TStoreItem = {
  id: number
  name: string
  price: number
  purchased: boolean
  subCategory: string
} & TStoreItemBackground

export const useStoreStore = defineStore('store', () => {
  const coins = ref(13)

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
    1: { id: 1, name: 'Default', price: 0, category: 'background', subCategory: '', purchased: true, backgroundCategory: 'color', color: '#171717' },
    2: { id: 2, name: 'Fall', price: 10, category: 'background', subCategory: '4 seasons', purchased: false, backgroundCategory: 'color', color: '#451a03' },
    3: { id: 3, name: 'Winter', price: 10, category: 'background', subCategory: '4 seasons', purchased: false, backgroundCategory: 'color', color: '#172554' },
    4: { id: 4, name: 'Spring', price: 10, category: 'background', subCategory: '4 seasons', purchased: false, backgroundCategory: 'color', color: '#1a2e05' },
    5: { id: 5, name: 'Summer', price: 10, category: 'background', subCategory: '4 seasons', purchased: false, backgroundCategory: 'color', color: '#fff' },
    // { name: 'Default', price: 10, category: 'font', purchased: true },
    // { name: 'Custom', price: 20, category: 'font', purchased: true },
    // { name: 'Border', price: 10, category: 'button', purchased: true },
    // { name: 'Click', price: 20, category: 'button', purchased: false },
  })
  const allItemsArray = computed(() => Object.values(allItems.value))

  const chosenCategoryItem = ref<Record<keyof TSoreCategory, TStoreItem['id'] | null>>({
    background: 1,
    button: null,
    font: null,
  })
  const choseCategoryItem = (category: keyof TSoreCategory, id: TStoreItem['id']) => chosenCategoryItem.value[category] = id

  const purchasedItems = computed(() => allItemsArray.value.filter(item => item.purchased))
  const availableItems = computed(() => allItemsArray.value.filter(item => !item.purchased))

  const purchasingItem = ref<TStoreItem | null>(null)
  function selectPurchasingItem(item: TStoreItem) {
    purchasingItem.value = item
  }
  function purchaseItem() {
    if (!purchasingItem.value)
      return

    allItems.value[purchasingItem.value.id].purchased = true
    coins.value -= purchasingItem.value.price
    purchasingItem.value = null
  }
  function cancelPurchase() {
    purchasingItem.value = null
  }

  return {
    coins,

    allItems,
    purchasedItems,
    availableItems,

    chosenCategoryItem,
    choseCategoryItem,

    purchasingItem: readonly(purchasingItem),
    selectPurchasingItem,
    purchaseItem,
    cancelPurchase,
  }
})
