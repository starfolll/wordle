import { trpcClient } from '@/api/trpcClient'
import { defineStore } from 'pinia'
import { type AnyStoreItemData, type AnyUniquelySelectableStoreItemData, type StoreItemBackgroundData, StoreItemCategoryData, type StoreItemFontData, type StoreItemThemeData, type TStoreItemCategoryData } from 'types.app'
import { computed, readonly, ref, watch } from 'vue'
import { storeItemsPurchasedDefault } from './store-items-purchased-default'

export const useStoreStore = defineStore('shop', () => {
  const isStoreLoaded = ref(false)

  const coins = ref(0)
  const diamonds = ref(0)

  const storeItems = ref<Record<AnyStoreItemData['id'], AnyStoreItemData>>({})

  const purchasedItems = ref<Record<AnyStoreItemData['id'], AnyStoreItemData>>({ ...storeItemsPurchasedDefault })
  const addPurchasedItem = (item: AnyStoreItemData) => purchasedItems.value[item.id] = item
  const resetPurchasedItems = () => purchasedItems.value = { ...storeItemsPurchasedDefault }

  const availableItems = computed<AnyStoreItemData[]>(() => Object.values(storeItems.value).filter(item => !purchasedItems.value[item.id]))

  const purchasingItemId = ref<AnyStoreItemData['id'] | null>(null)
  const setCheckoutItem = (itemId: AnyStoreItemData['id']) => purchasingItemId.value = itemId
  const cancelCheckout = () => purchasingItemId.value = null
  const purchasingItem = computed(() => purchasingItemId.value ? storeItems.value[purchasingItemId.value] : null)
  const purchaseItem = async () => {
    if (!purchasingItem.value || coins.value < purchasingItem.value.price)
      return null

    await trpcClient.purchaseStoreItem.mutate({ itemId: purchasingItem.value.id })

    addPurchasedItem(purchasingItem.value)
    coins.value -= purchasingItem.value.price
    purchasingItemId.value = null
  }

  const selectedItemsId = ref({
    background: storeItemsPurchasedDefault.background_default.id,
    theme: storeItemsPurchasedDefault.theme_default.id,
    font: storeItemsPurchasedDefault.font_default.id,
  } satisfies {
    [_key in AnyUniquelySelectableStoreItemData as AnyUniquelySelectableStoreItemData['category']]: AnyUniquelySelectableStoreItemData['id']
  })
  const selectedItems = computed(() => ({
    background: purchasedItems.value[selectedItemsId.value.background] as StoreItemBackgroundData,
    theme: purchasedItems.value[selectedItemsId.value.theme] as StoreItemThemeData,
    font: purchasedItems.value[selectedItemsId.value.font] as StoreItemFontData,
  } satisfies {
    [_key in AnyUniquelySelectableStoreItemData as AnyUniquelySelectableStoreItemData['category']]: Extract<AnyStoreItemData, { category: _key['category'] }>
  }))
  const setSelectedItem = (item: AnyStoreItemData) => {
    if (item.category === StoreItemCategoryData.sticker)
      return

    selectedItemsId.value[item.category] = item.id
  }

  async function loadStore() {
    isStoreLoaded.value = false

    const allItems = (await trpcClient.getItemsInStore.query())
    storeItems.value = allItems.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<AnyStoreItemData['id'], AnyStoreItemData>)

    isStoreLoaded.value = true
  }

  async function loadInventory() {
    const inventory = await trpcClient.getUserInventory.query()

    resetPurchasedItems()
    coins.value = inventory.coins
    diamonds.value = inventory.diamonds
    inventory.purchasedStoreItems.forEach(addPurchasedItem)
  }

  return {
    isStoreLoaded: readonly(isStoreLoaded),

    coins,
    diamonds,

    purchasedItems: readonly(purchasedItems),
    availableItems,

    purchasingItemId,
    setCheckoutItem,
    cancelCheckout,
    purchasingItem,
    purchaseItem,

    selectedItemsId: readonly(selectedItemsId),
    selectedItems,
    setSelectedItem,

    loadStore,
    loadInventory,
  }
})
