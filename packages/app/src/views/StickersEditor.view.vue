<script lang="ts" setup>
import type { TShopItemStickerData } from 'types'
import StickerControls from '@/components/stickers/sticker-controls.vue'
import StickerHighlighter from '@/components/stickers/sticker-highlighter.vue'
import Sticker from '@/components/stickers/sticker.vue'
import ButtonBase from '@/components/ui/buttons/button-base.vue'
import ButtonCircle from '@/components/ui/buttons/button-circle.vue'
import TooltipContainer from '@/components/ui/tooltip-container.vue'
import { usePlacedStickersStore } from '@/stores/placed-stickers/placed-stickers.store'
import { useShopStore } from '@/stores/shop/shop.store'
import { vOnLongPress } from '@vueuse/components'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const placedStickersStore = usePlacedStickersStore()
const shopStore = useShopStore()

const purchasedStickers = computed(() => {
  return Object
    .values(shopStore.purchasedItems)
    .filter(item => item.category === 'sticker') as TShopItemStickerData[]
})

const stickersScrollableAreaRef = ref<null | HTMLDivElement>(null)

const isShowingPurchasedStickers = ref(false)
const isScrolling = ref(false)
const isUIVisibleOnScroll = ref(false)

function focusStickerAtIndex(index: number, behavior?: ScrollBehavior) {
  if (stickersScrollableAreaRef.value === null)
    return

  const item = Array.from(stickersScrollableAreaRef.value.children).at(index) as HTMLElement
  stickersScrollableAreaRef.value.scrollTo({
    left: item.offsetLeft - stickersScrollableAreaRef.value.clientWidth / 2 + item.clientWidth / 2,
    behavior: behavior ?? 'smooth',
  })
}

function addSticker(stickerId: TShopItemStickerData['id']) {
  const sticker = placedStickersStore.placeStickerRandomly(stickerId)

  if (sticker === null)
    return

  requestAnimationFrame(() => focusStickerAtIndex(-1))

  if (placedStickersStore.placedStickersCount === 1)
    placedStickersStore.setHighlightedStickerPlacementId(sticker.placementId)
}

function removeHightedSticker() {
  const placementId = placedStickersStore.highlightedStickerPlacementId
  if (placementId === null)
    return

  const placedStickerIndex = placedStickersStore.placementAndSticker.findIndex(({ placement }) => placement.placementId === placementId)
  const nextPlacementId = placedStickersStore.placementAndSticker[placedStickerIndex + 1]?.placement.placementId ?? null
  const previousPlacementId = placedStickersStore.placementAndSticker[placedStickerIndex - 1]?.placement.placementId ?? null

  placedStickersStore.removeSticker(placementId)
  focusStickerAtIndex(placedStickerIndex === 0 ? 0 : placedStickerIndex)
  placedStickersStore.setHighlightedStickerPlacementId(nextPlacementId ?? previousPlacementId)
}

const hoveredStickerIndex = ref(0)
function handleScroll(e: Event) {
  const target = e.target as HTMLElement

  const maxScrollPosition = target.scrollWidth - target.clientWidth
  const scrollPosition = target.scrollLeft

  hoveredStickerIndex.value = Math.round((scrollPosition / maxScrollPosition) * (placedStickersStore.placedStickersCount - 1)) || 0
  const stickerPlacementId = placedStickersStore.placedStickersArray[hoveredStickerIndex.value]?.placementId

  if (stickerPlacementId !== null)
    placedStickersStore.setHighlightedStickerPlacementId(stickerPlacementId)
}

function moveStickerLeft() {
  placedStickersStore.swapPlacedStickers(hoveredStickerIndex.value, hoveredStickerIndex.value - 1)
  focusStickerAtIndex(hoveredStickerIndex.value, 'instant')
}
function moveStickerLeftEnd() {
  placedStickersStore.swapPlacedStickers(hoveredStickerIndex.value, 0)
  focusStickerAtIndex(1, 'instant')
}
function moveStickerRight() {
  placedStickersStore.swapPlacedStickers(hoveredStickerIndex.value, hoveredStickerIndex.value + 1)
  focusStickerAtIndex(hoveredStickerIndex.value + 2, 'instant')
}
function moveStickerRightEnd() {
  placedStickersStore.swapPlacedStickers(hoveredStickerIndex.value, placedStickersStore.placedStickersCount - 1)
  focusStickerAtIndex(placedStickersStore.placedStickersCount, 'instant')
}

onMounted(() => {
  if (placedStickersStore.placedStickersArray.length === 0)
    return

  focusStickerAtIndex(0)
  placedStickersStore.setHighlightedStickerPlacementId(placedStickersStore.placedStickersArray[0].placementId)
})
</script>

<template>
  <div class="h-full">
    <Teleport to="body">
      <StickerControls />
    </Teleport>

    <Teleport to="body">
      <StickerHighlighter
        v-if="placedStickersStore.editingStickerPlacementId === null"
        class="-z-10"
      />
    </Teleport>

    <main
      class="flex flex-col justify-end h-full gap-4 p-2 transition-opacity"
      :class="{
        'opacity-10': isScrolling && !isUIVisibleOnScroll,
        'hidden': placedStickersStore.editingStickerPlacementId !== null,
      }"
    >
      <section
        class="grow"
        :class="{
          'opacity-0 pointer-events-none': isScrolling,
        }"
      >
        <ButtonCircle @click="router.go(-1)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </ButtonCircle>
      </section>

      <section
        class="grid gap-2 p-1 overflow-y-auto transition-opacity rounded-lg max-h-80 bg-neutral-900"
        :class="[{
          'opacity-0 pointer-events-none': !isShowingPurchasedStickers || isScrolling,
        }]"
      >
        <p class="p-1 text-lg text-center text-current-100">
          Purchased stickers
        </p>
        <p class="p-1 text-center text-neutral-400">
          Click on a sticker to add it to the background
        </p>

        <div class="grid grid-cols-4 gap-1">
          <ButtonBase
            v-for="sticker in purchasedStickers"
            :key="sticker.id"
            :disabled="placedStickersStore.isStickersLimitReached"
            class="p-2 rounded-lg justify-items-center bg-neutral-800 aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
            @click="addSticker(sticker.id)"
          >
            <Sticker :sticker="sticker" />
          </ButtonBase>
        </div>
      </section>

      <section
        class="flex gap-2 transition-opacity"
        :class="{
          'opacity-0': isScrolling,
        }"
      >
        <div class="flex items-center px-4 py-1 text-lg rounded-lg text-neutral-400 bg-neutral-900">
          <p>
            Placed stickers
            <span class="text-current-100">{{ placedStickersStore.placedStickersCount }}</span>
            /
            {{ placedStickersStore.maxPlacedStickers }}
          </p>
        </div>

        <ButtonCircle class="ml-auto" @click="isShowingPurchasedStickers = !isShowingPurchasedStickers">
          <Transition name="fade" mode="out-in">
            <font-awesome-icon v-if="isShowingPurchasedStickers" :icon="['fas', 'minus']" />
            <font-awesome-icon v-else :icon="['fas', 'plus']" />
          </Transition>
        </ButtonCircle>

        <Transition name="fade" mode="out-in">
          <ButtonCircle @click="isUIVisibleOnScroll = !isUIVisibleOnScroll">
            <font-awesome-icon v-if="isUIVisibleOnScroll" :icon="['fas', 'eye']" />
            <font-awesome-icon v-else :icon="['fas', 'eye-slash']" />
          </ButtonCircle>
        </Transition>
      </section>

      <section
        class="flex justify-center gap-2 transition-opacity"
        :class="{
          'opacity-0': isScrolling,
        }"
      >
        <ButtonCircle
          v-on-long-press="[placedStickersStore.removeAllStickers, { delay: 1000, modifiers: { stop: true, prevent: true } }]"
          :disabled="isScrolling || placedStickersStore.highlightedStickerPlacementId === null"
          class="text-lg text-red-500 border-2 border-red-500 bg-neutral-800 disabled:border-opacity-60"
          @click="removeHightedSticker"
        >
          <font-awesome-icon :icon="['fas', 'trash']" />
        </ButtonCircle>

        <TooltipContainer class="relative flex ml-auto rounded-full bg-neutral-800">
          <template #tooltip>
            move order
          </template>

          <ButtonCircle
            v-on-long-press="[moveStickerLeftEnd, { delay: 500, modifiers: { stop: true, prevent: true } }]"
            :disabled="isScrolling
              || placedStickersStore.highlightedStickerPlacementId === null
              || hoveredStickerIndex === 0"
            class="rounded-r-none"
            @click="moveStickerLeft"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </ButtonCircle>
          <ButtonCircle
            v-on-long-press="[moveStickerRightEnd, { delay: 500, modifiers: { stop: true, prevent: true } }]"
            :disabled="isScrolling
              || placedStickersStore.highlightedStickerPlacementId === null
              || hoveredStickerIndex === placedStickersStore.placedStickersCount - 1"
            class="rounded-l-none"
            @click="moveStickerRight"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </ButtonCircle>
        </TooltipContainer>

        <TooltipContainer class="relative flex rounded-full bg-neutral-800">
          <template #tooltip>
            undo / redo
          </template>

          <ButtonCircle
            class="rounded-r-none"
            :disabled="isScrolling || !placedStickersStore.placedStickersHistory.canUndo"
            @click="placedStickersStore.placedStickersHistory.undo"
          >
            <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" />
          </ButtonCircle>
          <ButtonCircle
            class="rounded-l-none"
            :disabled="isScrolling || !placedStickersStore.placedStickersHistory.canRedo"
            @click="placedStickersStore.placedStickersHistory.redo"
          >
            <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" />
          </ButtonCircle>
        </TooltipContainer>
      </section>

      <Transition name="fade" mode="out-in">
        <section
          v-if="placedStickersStore.placedStickersCount === 0"
          class="content-center w-full text-xl text-center rounded-lg h-28 bg-neutral-900 text-neutral-400 text-balance"
        >
          Click on a
          <ButtonCircle class="text-base text-current-100">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </ButtonCircle>
          sign to add a sticker
        </section>

        <section
          v-else
          class="relative w-full overflow-y-hidden rounded-lg bg-neutral-900"
        >
          <div
            ref="stickersScrollableAreaRef"
            class="flex gap-1 py-4 overflow-x-auto list-decimal list-inside scrollbar-height-0 snap-mandatory snap-x flex-nowrap"
            @scroll="handleScroll"
            @touchmove="isScrolling = true"
            @touchend="isScrolling = false"
          >
            <div class="min-w-[calc(100%/2-5rem/2-0.25rem)]" />

            <TooltipContainer
              v-for="{ sticker, placement }, i in placedStickersStore.placementAndSticker"
              :key="placement.placementId + i"
            >
              <template #tooltip>
                <span class="text-neutral-400">
                  {{ i + 1 }}
                </span>
              </template>

              <ButtonBase
                class="p-2 rounded-lg justify-items-center snap-center min-w-20 size-20 bg-neutral-800"
                @click="placedStickersStore.setEditingStickerPlacementId(placement.placementId)"
              >
                <Sticker :sticker="sticker" />
              </ButtonBase>
            </TooltipContainer>

            <div class="min-w-[calc(100%/2-5rem/2-0.25rem)]" />
          </div>

          <div class="absolute -translate-x-1/2 -translate-y-1/2 border-2 border-b-0 rounded-lg pointer-events-none border-current-400/30 size-20 top-1/2 left-1/2" />
        </section>
      </Transition>
    </main>
  </div>
</template>
