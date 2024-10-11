<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="flex items-center justify-center h-full">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>
