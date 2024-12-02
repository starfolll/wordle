import type { ShopItemStickerData } from 'types.app'
import { useDebounceFn, useRefHistory } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, readonly, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '../shop/shop.store'
import { loadPlacedStickers, savePlacedStickers, type TPlacedSticker } from './placed-stickers-storage'

export const usePlacedStickersStore = defineStore('placed-stickers', () => {
  const shopStore = useShopStore()
  const route = useRoute()

  const isStickersEditorOpen = computed(() => route.name === 'stickers-editor')

  const highlightedStickerPlacementId = ref<string | null>(null)
  const setHighlightedStickerPlacementId = (stickerId: TPlacedSticker['placementId'] | null) => highlightedStickerPlacementId.value = stickerId

  const editingStickerPlacementId = ref<string | null>(null)
  const setEditingStickerPlacementId = (stickerId: TPlacedSticker['placementId'] | null) => editingStickerPlacementId.value = stickerId

  const maxPlacedStickers = 50
  const placedStickers = ref<Record<TPlacedSticker['placementId'], TPlacedSticker>>(loadPlacedStickers())
  const placedStickersHistory = useRefHistory(placedStickers, { deep: true, capacity: 15 })
  watch(() => placedStickers.value, useDebounceFn(savePlacedStickers, 3000), { deep: true })

  const placedStickersContainerRef = ref<HTMLDivElement>()
  const placedStickersArray = computed(() => Object.values(placedStickers.value))
  const placedStickersCount = computed(() => placedStickersArray.value.length)
  const isStickersLimitReached = computed(() => placedStickersCount.value >= maxPlacedStickers)

  const swapPlacedStickers = (index1: number, index2: number) => {
    const placement1 = placedStickersArray.value[index1]
    const placement2 = placedStickersArray.value[index2]

    if (!placement1 || !placement2)
      return

    placedStickers.value[placement1.placementId] = { ...placement2, placementId: placement1.placementId }
    placedStickers.value[placement2.placementId] = { ...placement1, placementId: placement2.placementId }
  }

  const placeSticker = (placedSticker: Omit<TPlacedSticker, 'placementId'>) => {
    if (isStickersLimitReached.value)
      return null

    const placementId = crypto.randomUUID()
    const stickerPlacement = { ...placedSticker, placementId }

    placedStickers.value[placementId] = stickerPlacement
    return stickerPlacement
  }
  const placeStickerRandomly = (stickerId: ShopItemStickerData['id']) => {
    return placeSticker({
      stickerId,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: 0,
      scale: 1,
    })
  }
  const updateStickerPlacement = (placementId: string, update: Partial<TPlacedSticker>) => {
    if (!placedStickers.value[placementId])
      return

    placedStickers.value[placementId] = { ...placedStickers.value[placementId], ...update }
  }
  const removeSticker = (placementId: string) => {
    delete placedStickers.value[placementId]
  }
  const removeAllStickers = () => {
    placedStickers.value = {}
  }

  const getStickerFromId = (stickerId: ShopItemStickerData['id']) => shopStore.purchasedItems[stickerId] as ShopItemStickerData | null
  const placementAndSticker = computed(() => placedStickersArray.value.reduce((acc, placement) => {
    const sticker = getStickerFromId(placement.stickerId)

    if (sticker)
      acc.push({ sticker, placement })

    return acc
  }, [] as { sticker: ShopItemStickerData, placement: TPlacedSticker }[]))

  return {
    isStickersEditorOpen,

    highlightedStickerPlacementId: readonly(highlightedStickerPlacementId),
    setHighlightedStickerPlacementId,

    editingStickerPlacementId: readonly(editingStickerPlacementId),
    setEditingStickerPlacementId,

    maxPlacedStickers,
    placedStickers,
    placedStickersHistory,

    placedStickersContainerRef,
    placedStickersArray,
    placedStickersCount,
    isStickersLimitReached,

    swapPlacedStickers,

    placeSticker,
    placeStickerRandomly,
    updateStickerPlacement,
    removeSticker,
    removeAllStickers,

    placementAndSticker,
  }
})
