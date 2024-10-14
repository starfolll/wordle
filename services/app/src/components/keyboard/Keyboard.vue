<script setup lang="ts">
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { letterClassName, useWordleStore } from '@/stores/wordle.store'
import KeyCap from './KeyCap.vue'

const wordleStore = useWordleStore()

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const keyboardRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

const letterClassNameExtended = {
  ...letterClassName,
  none: 'bg-transparent',
} satisfies typeof letterClassName
</script>

<template>
  <div class="flex flex-col items-center gap-1 p-2 rounded-lg bg-neutral-900">
    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow1"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        class="relative"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}

          <span
            v-if="wordleStore.guessedLettersCount[letter] > 1"
            class="absolute text-base lowercase -translate-x-1/2 left-1/2 -bottom-1"
          >x{{ wordleStore.guessedLettersCount[letter] }}</span>
        </KeyCap>
      </button>
    </div>

    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow2"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        class="relative"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}

          <span
            v-if="wordleStore.guessedLettersCount[letter] > 1"
            class="absolute text-base lowercase -translate-x-1/2 left-1/2 -bottom-1"
          >x{{ wordleStore.guessedLettersCount[letter] }}</span>
        </KeyCap>
      </button>
    </div>

    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow3"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        class="relative"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}

          <span
            v-if="wordleStore.guessedLettersCount[letter] > 1"
            class="absolute text-base lowercase -translate-x-1/2 left-1/2 -bottom-1"
          >x{{ wordleStore.guessedLettersCount[letter] }}</span>
        </KeyCap>
      </button>

      <button
        v-squash-on-click
        v-global-key-press="(el, e) => !(e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"
        class="ml-2"
        @click="wordleStore.removeLastGuessingWordLetter"
      >
        <KeyCap tw-class="text-current-400">
          <font-awesome-icon :icon="['fas', 'delete-left']" />
        </KeyCap>
      </button>

      <button
        v-squash-on-click
        v-global-key-press="(el, e) => (e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"
        @click="wordleStore.clearGuessingWord"
      >
        <KeyCap tw-class="text-current-400">
          <font-awesome-icon :icon="['fas', 'eraser']" />
        </KeyCap>
      </button>
    </div>
  </div>
</template>
