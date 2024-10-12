<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="w-full max-w-96">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>
