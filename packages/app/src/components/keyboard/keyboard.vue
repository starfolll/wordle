<script setup lang="ts">
import { vGlobalKeyPress } from '@/directives/animations/v-global-key-press'
import { playSquashAnimation, vSquashOnClick } from '@/directives/animations/v-squash-on-click'
import { letterClassName } from '@/helpers/class-names/matching-letter'
import { useWordleStore } from '@/stores/wordle.store'
import { GameProgressType } from 'types.app'
import Keycap from './keyboard-keycap.vue'

const wordleStore = useWordleStore()

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const keyboardRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

const keyboardRows = [keyboardRow1, keyboardRow2, keyboardRow3]

const letterClassNameExtended = {
  ...letterClassName,
  none: 'bg-transparent',
} satisfies typeof letterClassName
</script>

<template>
  <div class="relative flex flex-col items-center gap-1 p-2 rounded-lg bg-neutral-900/90">
    <div class="absolute flex w-full px-4 -mt-1 top-full">
      <div class="gap-2 px-2 text-lg font-semibold uppercase rounded text-neutral-400 bg-neutral-800">
        {{ wordleStore.wordLearnLevel }}
      </div>
    </div>

    <div
      v-if="wordleStore.gameType === GameProgressType.withHintGameProgress"
      class="flex items-center w-full gap-4 px-2 py-1 mb-2"
    >
      <div class="text-xl text-center rounded grow text-current-100 text-balance">
        {{ wordleStore.wordHint?.[0].toUpperCase() }}{{ wordleStore.wordHint?.slice(1) }}
      </div>
    </div>

    <div
      v-for="(row, rowIndex) in keyboardRows"
      :key="rowIndex"
      class="flex justify-center w-full gap-1"
    >
      <Keycap
        v-for="letter in row"
        :key="letter"
        v-squash-on-click
        v-global-key-press="(el, e) => e.key.toLocaleLowerCase() === letter && playSquashAnimation(el)"
        :class="[letterClassNameExtended[wordleStore.guessedLettersTag[letter]] || '']"
        class="relative"
        @click="wordleStore.addGuessingWordLetter(letter)"
      >
        {{ letter }}

        <span
          v-if="wordleStore.guessedLettersCount[letter] > 1"
          class="absolute text-base lowercase -translate-x-1/2 left-1/2 -bottom-1"
        >
          x{{ wordleStore.guessedLettersCount[letter] }}
        </span>
      </Keycap>

      <template v-if="rowIndex === 2">
        <button
          v-squash-on-click
          v-global-key-press="(el, e) => !(e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"
          class="ml-2"
          @click="wordleStore.removeLastGuessingWordLetter"
        >
          <Keycap class="w-10 text-current-400">
            <font-awesome-icon :icon="['fas', 'delete-left']" />
          </Keycap>
        </button>

        <button
          v-squash-on-click
          v-global-key-press="(el, e) => (e.shiftKey || e.ctrlKey) && e.key === 'Backspace' && playSquashAnimation(el)"

          @click="wordleStore.clearGuessingWord"
        >
          <Keycap class="w-10 text-current-400">
            <font-awesome-icon :icon="['fas', 'eraser']" />
          </Keycap>
        </button>
      </template>
    </div>
  </div>
</template>
