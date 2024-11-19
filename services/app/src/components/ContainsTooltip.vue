<template>
  <div class="relative">
    <slot name="default" />

    <div class="absolute text-sm text-nowrap -translate-x-1/2 pointer-events-none translate-y-1/2 rounded-full bottom-0 left-1/2 bg-neutral-900 px-2 py-0.5">
      <slot name="tooltip" />
    </div>
  </div>
</template>
