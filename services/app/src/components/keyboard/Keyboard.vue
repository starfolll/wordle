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
  none: 'bg-neutral-900',
} satisfies typeof letterClassName
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow1"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </KeyCap>
      </button>
    </div>

    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow2"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </KeyCap>
      </button>
    </div>

    <div class="flex justify-center w-full gap-1">
      <button
        v-for="letter in keyboardRow3"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        <KeyCap :tw-class="letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </KeyCap>
      </button>

      <button
        v-squash-on-click
        v-global-key-press="(el, e) => !(e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"
        class="ml-2"
        @click="wordleStore.removeLastGuessingWordLetter"
      >
        <KeyCap tw-class="text-neutral-400">
          <font-awesome-icon :icon="['fas', 'delete-left']" />
        </KeyCap>
      </button>

      <button
        v-squash-on-click
        v-global-key-press="(el, e) => (e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"
        @click="wordleStore.clearGuessingWord"
      >
        <KeyCap tw-class="text-neutral-400">
          <font-awesome-icon :icon="['fas', 'eraser']" />
        </KeyCap>
      </button>
    </div>
  </div>
</template>
