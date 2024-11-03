import { trpcClient } from '@/api/trpcClient'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { type AnyStoreItemData, type AnyUniquelySelectableStoreItemData, StoreItemCategoryData } from 'types.app'
import { computed, readonly, ref } from 'vue'
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

  const selectedItemsId = useLocalStorage<{
    [_key in AnyUniquelySelectableStoreItemData as AnyUniquelySelectableStoreItemData['category']]: AnyUniquelySelectableStoreItemData['id'] | null
  }>('selectedStoreItemsId', {
    background: null,
    theme: null,
    font: null,
  })
  const getItemWithDefault = <T extends AnyUniquelySelectableStoreItemData['category']>(
    category: T,
  ): Extract<AnyUniquelySelectableStoreItemData, { category: T }> => {
    const itemId = selectedItemsId.value[category]
    const item = itemId ? purchasedItems.value[itemId] : null
    return item as any ?? storeItemsPurchasedDefault[category]
  }
  const selectedItems = computed(() => ({
    background: getItemWithDefault(StoreItemCategoryData.background),
    theme: getItemWithDefault(StoreItemCategoryData.theme),
    font: getItemWithDefault(StoreItemCategoryData.font),
  } satisfies {
    [_key in AnyUniquelySelectableStoreItemData as AnyUniquelySelectableStoreItemData['category']]: Extract<AnyStoreItemData, { category: _key['category'] }>
  }))
  const setSelectedItem = async (item: AnyStoreItemData) => {
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
