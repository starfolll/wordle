<script setup lang="ts">
import WordCell from './wordRows/WordCell.vue'
import WordsContainer from './wordRows/WordsContainer.vue'

const keyboardRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const keyboardRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const keyboardRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <WordsContainer>
      <button v-for="letter in keyboardRow1" :key="letter">
        <WordCell>
          {{ letter }}
        </WordCell>
      </button>
    </WordsContainer>
    <WordsContainer>
      <button v-for="letter in keyboardRow2" :key="letter">
        <WordCell>
          {{ letter }}
        </WordCell>
      </button>
    </WordsContainer>
    <WordsContainer>
      <button v-for="letter in keyboardRow3" :key="letter">
        <WordCell>
          {{ letter }}
        </WordCell>
      </button>
    </WordsContainer>
  </div>
</template>
