<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from '../Dialog.vue'
import ButtonToggle from '../ui/buttons/button-toggle.vue'
import HtpClassic from './htp-classic.vue'
import HtpDailyChallenge from './htp-daily-challenge.vue'
import HtpWithHint from './htp-with-hint.vue'

defineProps<{
  close: () => void
}>()

const open = defineModel<boolean>('open')

const sectionsToComponent = {
  'Classic Game': HtpClassic,
  'Daily Challenge': HtpDailyChallenge,
  'With Hint': HtpWithHint,
} as const
const sectionsName = Object.keys(sectionsToComponent) as unknown as keyof typeof sectionsToComponent

const activeSection = ref<typeof sectionsName>('Classic Game')
const activeComponent = computed(() => sectionsToComponent[activeSection.value])
</script>

<template>
  <Dialog
    v-model:open="open"
    :on-close="close"
    class="h-full scrollbar-width-0"
  >
    <template #title>
      <p class="text-3xl">
        How to play?
      </p>
    </template>

    <div class="flex flex-wrap justify-between gap-2">
      <ButtonToggle
        v-for="section in sectionsName"
        :key="section"
        v-model="activeSection"
        :value="section"
      >
        {{ section }}
      </ButtonToggle>
    </div>

    <component :is="activeComponent" />
  </Dialog>
</template>
