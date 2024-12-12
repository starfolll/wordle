<script setup lang="ts">
import type { TShopItemThemeData } from 'types.app'

const props = defineProps<{
  item: TShopItemThemeData
}>()
</script>

<template>
  <div class="flex items-center p-1 size-full">
    <div
      class="flex flex-col justify-between gap-1 p-2 rounded text-current-100 size-full bg-current-800"
      :style="props.item.data.themeVariables"
    >
      Theme

      <div class="p-2 text-center rounded-full bg-current-700">
        Purchase
      </div>

      <div class="flex justify-between gap-0.5">
        <font-awesome-icon :icon="['fas', 'circle-check']" size="sm" />
        <font-awesome-icon :icon="['fas', 'arrow-right']" size="sm" />
        <font-awesome-icon :icon="['fas', 'fire']" size="sm" />
        <font-awesome-icon :icon="['fas', 'home']" size="sm" />
      </div>
    </div>
  </div>
</template>
