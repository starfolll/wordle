<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useGamesProgressStore } from './stores/gamesProgress.store'
import { useStoreStore } from './stores/store/store.store'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const storeStore = useStoreStore()
const gamesProgressStore = useGamesProgressStore()

const fontStyleComponent = computed(() => h('style', {}, `
  @import url(${storeStore.selectedItems.font.data.fontUrl});
  body { font-family: ${storeStore.selectedItems.font.data.fontName}, system-ui; }
`))

onMounted(async () => {
  await userStore.login()

  storeStore.loadInventory()
  gamesProgressStore.loadGameProgress()
})
</script>

<template>
  <Transition name="fade">
    <div
      :key="storeStore.selectedItems.background.id"
      class="fixed top-0 left-0 w-full h-full -z-10"
      :style="{ background: storeStore.selectedItems.background.data.background }"
    />
  </Transition>

  <component :is="fontStyleComponent" />

  <div
    class="flex items-center justify-center h-full"
    :style="storeStore.selectedItems.theme.data.themeVariables"
  >
    <div class="w-full h-full px-2 py-4 max-w-[520px] text-current-100">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
