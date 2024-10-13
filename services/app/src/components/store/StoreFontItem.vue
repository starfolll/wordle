<script setup lang="ts">
import type { TStoreItemFont } from '@/stores/store.store'
import { computed, h } from 'vue'

const props = defineProps<{
  item: TStoreItemFont
}>()

const content = [
  'Dreams never end',
  'Silence calms souls',
  'Love conquers all',
  'Time flies fast',
  'Mountains inspire peace',
  'Create, learn, grow',
  'Trust builds bridges',
  'Ideas spark change',
  'Freedom feels priceless',
  'Always stay curious',
  'Time is illusion',
  'Wakanda foreva!',
  'Roger Roger',
  '🍰 Cake is a lie?',
  '💀 By the power of Grayskull!',
]

const randomContent = content[Math.floor(Math.random() * content.length)]

const fontStyle = computed(() => h('style', {}, `@import url(${props.item.fontUrl});`))
</script>

<template>
  <div class="flex items-center justify-center w-full h-full p-2 text-xl text-center bg-neutral-700 text-neutral-100">
    <component :is="fontStyle" />

    <span :style="`font-family: ${props.item.fontName}, system-ui;`">
      {{ randomContent }}
    </span>
  </div>
</template>
