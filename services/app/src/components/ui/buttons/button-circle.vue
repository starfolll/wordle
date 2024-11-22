<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { type ButtonHTMLAttributes, useAttrs } from 'vue'
import ButtonBase from './button-base.vue'

type TProps = /* @vue-ignore */ ButtonHTMLAttributes

defineOptions({ inheritAttrs: false })
defineProps<TProps>()

const attrs = useAttrs()
</script>

<template>
  <ButtonBase
    v-bind="{ ...attrs, class: null }"
    :class="twMerge(
      'transition-colors z-0 rounded-full text-current-100 size-12 bg-current-700',
      'disabled:text-opacity-30 disabled:cursor-not-allowed',
      attrs.class as string ?? '',
    )"
  >
    <slot />
  </ButtonBase>
</template>
