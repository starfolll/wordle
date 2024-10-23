<script setup lang="ts">
import { computed, h } from 'vue'
import { RouterView } from 'vue-router'
import { useUserData } from './api/useUserData'
import { useThemeStore } from './stores/theme.store'

const themeStore = useThemeStore()

const fontStyle = computed(() => h('style', {}, `
  @import url(${themeStore.theme.font.fontUrl});
  body { font-family: ${themeStore.theme.font.fontName}, system-ui; }
`))

const backgroundId = computed(() => themeStore.theme.background.id || Math.random())

const user = useUserData()
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
