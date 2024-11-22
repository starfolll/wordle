<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { computed } from 'vue'
import ButtonBase from './button-base.vue'

const props = defineProps<{
  value: /* @vue-ignore */ InputHTMLAttributes['value']
}>()

const model = defineModel()
const isActive = computed(() => props.value === model.value)

function setActive() {
  model.value = props.value
}
</script>

<template>
  <ButtonBase
    :disabled="isActive"
    class="px-4 text-lg text-left transition-colors border-2 rounded-full scrollbar-width-0"
    :class="[isActive
      ? 'bg-transparent border-current-800 cursor-not-allowed text-current-400'
      : 'bg-current-800 text-current-100 hover:bg-current-700 border-current-800 hover:border-current-700',
    ]"
    @click="setActive"
  >
    <slot />
  </ButtonBase>
</template>
