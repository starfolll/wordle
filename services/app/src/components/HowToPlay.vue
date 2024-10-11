<script setup lang="ts">
import { letterClassName } from '@/stores/wordle.store'
import { vOnClickOutside } from '@vueuse/components'
import LetterCell from './wordRows/LetterCell.vue'
import WordContainer from './wordRows/WordContainer.vue'

defineProps<{
  close: () => void
}>()
</script>

<template>
  <section class="fixed top-0 left-0 z-10 grid bg-neutral-900/70 w-dvw h-dvh">
    <div class="flex flex-col items-center justify-center">
      <div
        v-on-click-outside="close"
        class="relative flex flex-col gap-8 p-6 border-2 rounded backdrop-blur border-neutral-800 bg-neutral-900/90"
      >
        <p class="text-3xl text-center">
          How to play?
        </p>

        <button
          class="absolute w-10 h-10 rounded-full right-4 top-4 bg-neutral-800 hover:bg-neutral-700"
          @click="close"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>

        <p>
          The goal of the game is to guess the word.<br>
        </p>

        <p>
          You have 5 attempts to guess the word with length of 4 letters. <br>
          And 6 attempts to guess the word with length of 5 letters.
        </p>

        <hr class="border-2 rounded-full border-neutral-800">

        <p class="text-xl">
          Example:
        </p>

        <div class="flex flex-col gap-8">
          <WordContainer>
            <LetterCell :tw-class="letterClassName.exact">
              c
            </LetterCell>
            <LetterCell>o</LetterCell>
            <LetterCell>s</LetterCell>
            <LetterCell>y</LetterCell>
          </WordContainer>

          <p>
            Letter
            <span :class="letterClassName.exact" class="px-1 font-bold rounded">C</span>
            in word
            <span class="px-1 font-bold tracking-widest rounded bg-neutral-800">COSY</span>
            is a exact match of a letter.<br>
            Meaning it is in the correct position.
          </p>

          <WordContainer>
            <LetterCell :tw-class="letterClassName.partial">
              d
            </LetterCell>
            <LetterCell>e</LetterCell>
            <LetterCell>m</LetterCell>
            <LetterCell>o</LetterCell>
          </WordContainer>

          <p>
            Letter
            <span :class="letterClassName.partial" class="px-1 font-bold rounded">D</span>
            in word
            <span class="px-1 font-bold tracking-widest rounded bg-neutral-800">DEMO</span>
            is a partial match of a letter.<br>
            Meaning it is in the word but not in the correct position.
          </p>

          <p>
            Other letters like
            <span class="px-1 mr-1 font-bold tracking-widest rounded bg-neutral-800">O</span>
            <span class="px-1 mr-1 font-bold tracking-widest rounded bg-neutral-800">S</span>
            <span class="px-1 font-bold tracking-widest rounded bg-neutral-800">Y</span>
            etc. are not in the word.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
