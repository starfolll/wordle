import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type TSoreCategory, type TStoreItem, type TStoreItemBackground, type TStoreItemFont, useStoreStore } from './store.store'

export const useThemeStore = defineStore('theme', () => {
  const storeStore = useStoreStore()

  const chosenCategoryItem = ref<Record<keyof TSoreCategory, TStoreItem['id']>>({
    background: 1,
    font: 6,
  })
  const chosenItemsIds = computed(() => new Set(Object.values(chosenCategoryItem.value)))
  const setChosenItem = (item: TStoreItem) => chosenCategoryItem.value[item.category] = item.id

  const theme = computed<{
    [_key in keyof TSoreCategory]: Extract<TStoreItem, { category: TSoreCategory[_key] }>
  }>(() => ({
    background: storeStore.allItems[chosenCategoryItem.value.background],
    font: storeStore.allItems[chosenCategoryItem.value.font],
  } as any))

  return {
    chosenCategoryItem,
    chosenItemsIds,
    setChosenItem,

    theme,
  }
})
