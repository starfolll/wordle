<script setup lang="ts">
import LetterCell from './wordRows/LetterCell.vue'
import WordContainer from './wordRows/WordContainer.vue'

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const keyboardRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <WordContainer>
      <button v-for="letter in keyboardRow1" :key="letter">
        <LetterCell>
          {{ letter }}
        </LetterCell>
      </button>
    </WordContainer>
    <WordContainer>
      <button v-for="letter in keyboardRow2" :key="letter">
        <LetterCell>
          {{ letter }}
        </LetterCell>
      </button>
    </WordContainer>
    <WordContainer>
      <button v-for="letter in keyboardRow3" :key="letter">
        <LetterCell>
          {{ letter }}
        </LetterCell>
      </button>
    </WordContainer>
  </div>
</template>
