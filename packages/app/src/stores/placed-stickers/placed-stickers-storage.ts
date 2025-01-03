import type { TShopItemStickerData } from 'types'

export interface TPlacedSticker {
  stickerId: TShopItemStickerData['id']
  placementId: string
  x: number
  y: number
  rotation: number
  scale: number
}

export interface TCompressedPlacedSticker {
  sId: TPlacedSticker['stickerId']
  pId: TPlacedSticker['placementId']
  x: number
  y: number
  r: number
  s: number
}

export type TStoredPlacedSticker = TCompressedPlacedSticker[]

const placedStickersLocalStorageKey = 'store_placed-stickers_placed_stickers'
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

export function loadPlacedStickers(): Record<TPlacedSticker['placementId'], TPlacedSticker> {
  if (!localStorage.getItem(placedStickersLocalStorageKey))
    localStorage.setItem(placedStickersLocalStorageKey, JSON.stringify(storedInitialPlacedStickers))

  return (JSON.parse(localStorage.getItem(placedStickersLocalStorageKey)!) as TStoredPlacedSticker).reduce((acc, compressedPlacement) => {
    const placement = decompressPlacedSticker(compressedPlacement)
    acc[placement.placementId] = placement
    return acc
  }, {} as ReturnType<typeof loadPlacedStickers>)
}

export function savePlacedStickers(placedStickers: Record<TPlacedSticker['placementId'], TPlacedSticker>) {
  localStorage.setItem(placedStickersLocalStorageKey, JSON.stringify(Object.values(placedStickers).map(compressPlacedSticker)))
}
