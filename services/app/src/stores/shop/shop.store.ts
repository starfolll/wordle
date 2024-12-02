import { trpcClient } from '@/api/trpcClient'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ShopItemCategoryData, type TAnyShopItemData, type TAnyUniquelySelectableShopItemData } from 'types.app'
import { computed, readonly, ref } from 'vue'
import { shopItemsPurchasedDefault } from './shop-items-purchased-default'

export const useShopStore = defineStore('shop', () => {
  const isShopLoaded = ref(false)

  const coins = ref(0)
  const diamonds = ref(0)

  const shopItems = ref<Record<TAnyShopItemData['id'], TAnyShopItemData>>({})
  const purchasedItems = ref<Record<TAnyShopItemData['id'], TAnyShopItemData>>({ ...shopItemsPurchasedDefault })
  const addPurchasedItem = (item: TAnyShopItemData) => purchasedItems.value[item.id] = item
  const resetPurchasedItems = () => purchasedItems.value = { ...shopItemsPurchasedDefault }
  const availableItems = computed<TAnyShopItemData[]>(() => Object.values(shopItems.value).filter(item => !purchasedItems.value[item.id]))

  const purchasingItemId = ref<TAnyShopItemData['id'] | null>(null)
  const setCheckoutItem = (itemId: TAnyShopItemData['id']) => purchasingItemId.value = itemId
  const cancelCheckout = () => purchasingItemId.value = null
  const purchasingItem = computed(() => purchasingItemId.value ? shopItems.value[purchasingItemId.value] : null)
  const purchaseItem = async () => {
    if (!purchasingItem.value || coins.value < purchasingItem.value.price)
      return null

    await trpcClient.purchaseStoreItem.mutate({ itemId: purchasingItem.value.id })

    addPurchasedItem(purchasingItem.value)
    coins.value -= purchasingItem.value.price
    purchasingItemId.value = null
  }

  const selectedItemsId = useLocalStorage<{
    [_key in TAnyUniquelySelectableShopItemData as TAnyUniquelySelectableShopItemData['category']]: TAnyUniquelySelectableShopItemData['id'] | null
  }>('selectedShopItemsId', {
    background: null,
    theme: null,
    font: null,
  })
  const getItemWithDefault = <T extends TAnyUniquelySelectableShopItemData['category']>(
    category: T,
  ): Extract<TAnyUniquelySelectableShopItemData, { category: T }> => {
    const itemId = selectedItemsId.value[category]
    const item = itemId ? purchasedItems.value[itemId] : null
    return item as any ?? shopItemsPurchasedDefault[category]
  }
  const selectedItems = computed(() => ({
    background: getItemWithDefault(ShopItemCategoryData.background),
    theme: getItemWithDefault(ShopItemCategoryData.theme),
    font: getItemWithDefault(ShopItemCategoryData.font),
  } satisfies {
    [_key in TAnyUniquelySelectableShopItemData as TAnyUniquelySelectableShopItemData['category']]: Extract<TAnyShopItemData, { category: _key['category'] }>
  }))
  const setSelectedItem = async (item: TAnyShopItemData) => {
    if (item.category === ShopItemCategoryData.sticker)
      return

    selectedItemsId.value[item.category] = item.id
  }

  async function loadShop() {
    isShopLoaded.value = false

    const allItems = (await trpcClient.getItemsInShop.query())
    shopItems.value = allItems.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<TAnyShopItemData['id'], TAnyShopItemData>)

    isShopLoaded.value = true
  }

  async function loadInventory() {
    const inventory = await trpcClient.getUserInventory.query()

    resetPurchasedItems()
    coins.value = inventory.coins
    diamonds.value = inventory.diamonds
    inventory.purchasedShopItems.forEach(addPurchasedItem)
  }

  return {
    isShopLoaded: readonly(isShopLoaded),

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

    loadShop,
    loadInventory,
  }
})
