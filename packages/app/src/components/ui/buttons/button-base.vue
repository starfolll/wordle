<script lang="ts" setup>
import type { ButtonHTMLAttributes } from 'vue'
import { vSquashOnClick } from '@/directives/animations/v-squash-on-click'

type TProps = /* @vue-ignore */ ButtonHTMLAttributes

const props = defineProps<TProps>()
</script>

<template>
  <button
    v-squash-on-click
    v-bind="props"
  >
    <slot />
  </button>
</template>
