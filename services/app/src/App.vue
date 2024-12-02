<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import StickerPlaced from './components/stickers/sticker-placed.vue'
import { useGamesProgressStore } from './stores/gamesProgress.store'
import { usePlacedStickersStore } from './stores/placed-stickers.store'
import { useShopStore } from './stores/shop/shop.store'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const shopStore = useShopStore()
const gamesProgressStore = useGamesProgressStore()
const placedStickersStore = usePlacedStickersStore()

const fontStyleComponent = computed(() => h('style', {}, `
  @import url(${shopStore.selectedItems.font.data.fontUrl});
  body { font-family: ${shopStore.selectedItems.font.data.fontName}, system-ui; }
`))

const placedStickersContainerRef = ref<HTMLDivElement>()
watch(
  () => placedStickersContainerRef.value,
  value => placedStickersStore.placedStickersContainerRef = value,
  { immediate: true },
)

onMounted(async () => {
  await userStore.login()

  shopStore.loadInventory()
  gamesProgressStore.loadGameProgress()
})
</script>

<template>
  <section>
    <Transition name="fade">
      <div
        :key="shopStore.selectedItems.background.id"
        class="fixed top-0 left-0 w-full h-full -z-10"
        :style="{ background: shopStore.selectedItems.background.data.background }"
      />
    </Transition>
  </section>

  <section
    ref="placedStickersContainerRef"
    class="relative pointer-events-none select-none -z-10"
  >
    <StickerPlaced
      v-for="{ placement, sticker } in placedStickersStore.placementAndSticker"
      :key="placement.placementId"
      :sticker="sticker"
      :placement="placement"
    />
  </section>

  <component :is="fontStyleComponent" />

  <div
    class="flex items-center justify-center h-full"
    :style="shopStore.selectedItems.theme.data.themeVariables"
  >
    <div class="w-full h-full max-w-[520px] text-current-100">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
