import type { StoreItemStickerData } from 'types.app'
import { useDebounceFn, useRefHistory } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, readonly, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { allThemes } from './allStoreItems'
import { useStoreStore } from './store.store'

export interface TPlacedSticker {
  stickerId: StoreItemStickerData['id']
  placementId: string
  x: number
  y: number
  rotation: number
  scale: number
}

console.log(allThemes)

const placedStickersLocalStorageKey = 'store_placed-stickers_placed_stickers'
interface TCompressedPlacedSticker {
  sId: TPlacedSticker['stickerId']
  pId: TPlacedSticker['placementId']
  x: number
  y: number
  r: number
  s: number
}
type TStoredPlacedSticker = TCompressedPlacedSticker[]
const storedInitialPlacedStickers: TStoredPlacedSticker = []
function compressPlacedSticker(placedSticker: TPlacedSticker): TCompressedPlacedSticker {
  return {
    sId: placedSticker.stickerId,
    pId: placedSticker.placementId,
    x: Number.parseFloat(placedSticker.x.toFixed(2)),
    y: Number.parseFloat(placedSticker.y.toFixed(2)),
    r: Number.parseFloat(placedSticker.rotation.toFixed(1)),
    s: Number.parseFloat(placedSticker.scale.toFixed(2)),
  }
}
function decompressPlacedSticker(compressedPlacedSticker: TCompressedPlacedSticker): TPlacedSticker {
  return {
    stickerId: compressedPlacedSticker.sId,
    placementId: compressedPlacedSticker.pId,
    x: compressedPlacedSticker.x,
    y: compressedPlacedSticker.y,
    rotation: compressedPlacedSticker.r,
    scale: compressedPlacedSticker.s,
  }
}
function loadPlacedStickers(): Record<TPlacedSticker['placementId'], TPlacedSticker> {
  if (!localStorage.getItem(placedStickersLocalStorageKey))
    localStorage.setItem(placedStickersLocalStorageKey, JSON.stringify(storedInitialPlacedStickers))

  return (JSON.parse(localStorage.getItem(placedStickersLocalStorageKey)!) as TStoredPlacedSticker).reduce((acc, compressedPlacement) => {
    const placement = decompressPlacedSticker(compressedPlacement)
    acc[placement.placementId] = placement
    return acc
  }, {} as ReturnType<typeof loadPlacedStickers>)
}
function savePlacedStickers(placedStickers: Record<TPlacedSticker['placementId'], TPlacedSticker>) {
  localStorage.setItem(placedStickersLocalStorageKey, JSON.stringify(Object.values(placedStickers).map(compressPlacedSticker)))
}

export const usePlacedStickersStore = defineStore('placed-stickers', () => {
  const storeStore = useStoreStore()
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
  const placeStickerRandomly = (stickerId: StoreItemStickerData['id']) => {
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

  const getStickerFromId = (stickerId: StoreItemStickerData['id']) => storeStore.purchasedItems[stickerId] as StoreItemStickerData | null
  const placementAndSticker = computed(() => placedStickersArray.value.reduce((acc, placement) => {
    const sticker = getStickerFromId(placement.stickerId)

    if (sticker)
      acc.push({ sticker, placement })

    return acc
  }, [] as { sticker: StoreItemStickerData, placement: TPlacedSticker }[]))

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
