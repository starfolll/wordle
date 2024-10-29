<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useGamesProgressStore } from './stores/gamesProgress.store'
import { useThemeStore } from './stores/theme.store'
import { useUserStore } from './stores/userStore'

const themeStore = useThemeStore()
const userStore = useUserStore()
const gamesProgressStore = useGamesProgressStore()

const fontStyle = computed(() => h('style', {}, `
  @import url(${themeStore.theme.font.fontUrl});
  body { font-family: ${themeStore.theme.font.fontName}, system-ui; }
`))

const backgroundId = computed(() => themeStore.theme.background.id || Math.random())

onMounted(async () => {
  await userStore.login()
  await gamesProgressStore.loadGameProgress()
})
</script>

<template>
  <Transition name="fade">
    <div
      :key="backgroundId"
      class="fixed top-0 left-0 w-full h-full -z-10"
      :style="{ background: themeStore.theme.background.background }"
    />
  </Transition>

  <component :is="fontStyle" />

  <div
    class="flex items-center justify-center h-full"
    :style="themeStore.theme.theme.themeVariables"
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
