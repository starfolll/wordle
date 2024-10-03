<script setup lang="ts">
import { matchingLetterTagToClass, useWordleStore } from '@/stores/wordle.store'
import LetterCell from './wordRows/LetterCell.vue'
import WordContainer from './wordRows/WordContainer.vue'

const wordleStore = useWordleStore()

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const keyboardRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <WordContainer>
      <button v-for="letter in keyboardRow1" :key="letter">
        <LetterCell :tw-class="matchingLetterTagToClass[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </LetterCell>
      </button>
    </WordContainer>

    <WordContainer>
      <button v-for="letter in keyboardRow2" :key="letter">
        <LetterCell :tw-class="matchingLetterTagToClass[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </LetterCell>
      </button>

      <button>
        <LetterCell tw-class="pt-1 text-green-300 bg-green-800">
          <font-awesome-icon :icon="['fas', 'turn-down']" rotation="90" />
        </LetterCell>
      </button>
    </WordContainer>

    <WordContainer>
      <button v-for="letter in keyboardRow3" :key="letter">
        <LetterCell :tw-class="matchingLetterTagToClass[wordleStore.guessedLettersTag[letter]] || ''">
          {{ letter }}
        </LetterCell>
      </button>

      <button>
        <LetterCell tw-class="text-yellow-300 bg-yellow-800">
          <font-awesome-icon :icon="['fas', 'delete-left']" />
        </LetterCell>
      </button>

      <button>
        <LetterCell tw-class="text-yellow-300 bg-yellow-800">
          <font-awesome-icon :icon="['fas', 'eraser']" />
        </LetterCell>
      </button>
    </WordContainer>
  </div>
</template>
