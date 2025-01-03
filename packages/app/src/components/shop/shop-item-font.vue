<script setup lang="ts">
import type { TShopItemFontData } from 'types'
import { fontAvailableAsync } from '@/fonts/font-available-async'

const props = defineProps<{
  item: TShopItemFontData
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
  'Roger Roger',
  'Cake is a lie',
]

const randomContent = content[Math.floor(Math.random() * content.length)]

const fontAsyncComponent = fontAvailableAsync[props.item.data.fontName]
</script>

<template>
  <div class="flex items-center justify-center w-full h-full p-2 text-xl text-center text-current-100">
    <component :is="fontAsyncComponent" />

    <span :style="`font-family: ${props.item.data.fontName}, system-ui;`">
      {{ randomContent }}
    </span>
  </div>
</template>
