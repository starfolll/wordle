<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { twMerge } from 'tailwind-merge'
import { type DialogHTMLAttributes, ref } from 'vue'
import { useAttrs, watch } from 'vue'
import CircleButton from './CircleButton.vue'

type TProps = /* @vue-ignore */ DialogHTMLAttributes

const props = withDefaults(defineProps<TProps & {
  showTitle?: boolean
  onClose?: () => void
}>(), {
  showTitle: true,
})
const open = defineModel<boolean>('open')
const attrs = useAttrs()

const dialogRef = ref<HTMLDialogElement>()

function openDialog() {
  dialogRef.value?.showModal()
}

function closeDialog() {
  dialogRef.value?.close()
  props.onClose?.()
}

watch(open, (value) => {
  if (value === undefined)
    return

  value ? openDialog() : closeDialog()
}, { immediate: true })

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    v-bind="{
      ...attrs,
      showTitle: undefined,
      onClose: undefined,
      class: null,
    }"
    :class="twMerge([
      'w-full bg-transparent opacity-0 open:opacity-100 p-4 backdrop:opacity-0 open:backdrop:opacity-100 max-w-[600px] backdrop:bg-neutral-900/60 backdrop:backdrop-blur text-neutral-100',
      attrs.class as string ?? '',
    ])"
  >
    <div
      v-on-click-outside="closeDialog"
      class="relative flex flex-col w-full gap-8 p-6 overflow-auto border-2 rounded-lg border-current-800 bg-neutral-900"
    >
      <nav
        v-if="showTitle"
        class="flex items-center gap-2"
      >
        <div class="text-left grow">
          <slot name="title" />
        </div>

        <CircleButton
          class="sticky top-0 right-0"
          @click="closeDialog"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </CircleButton>
      </nav>

      <slot />
    </div>
  </dialog>
</template>

<style lang="scss" scoped>
dialog {
  transition:
    opacity 0.3s ease-out,
    overlay 0.3s ease-out allow-discrete,
    display 0.3s ease-out allow-discrete;
}

dialog::backdrop {
  transition:
    opacity 0.3s ease-out;
}

@starting-style {
  dialog[open], dialog[open]::backdrop {
    opacity: 0;
  }
}
</style>
