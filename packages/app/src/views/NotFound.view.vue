<script setup lang="ts">
import ButtonBase from '@/components/ui/buttons/button-base.vue'
import WordLetter from '@/components/word/word-letter.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="flex flex-col items-center justify-center h-full gap-8">
    <div class="flex flex-col gap-4 text-center">
      <WordContainer class="text-current-400">
        <WordLetter v-for="letter in '404'.split('')" :key="letter">
          {{ letter }}
        </WordLetter>
      </WordContainer>

      <p class="text-xl text-current-100">
        Page not found
      </p>
    </div>

    <ButtonBase
      class="rounded-full min-w-12 bg-current-800 aspect-square"
      @click="router.push('/')"
    >
      <font-awesome-icon :icon="['fas', 'home']" />
    </ButtonBase>
  </main>
</template>
