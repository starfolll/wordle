<script setup lang="ts">
import { letterClassName } from '@/helpers/class-names/matching-letter'
import WordContainer from '../word/word-container.vue'
import WordLetter from '../word/word-letter.vue'
</script>

<template>
  <p>
    The goal of the game is to guess the word.
  </p>

  <div class="grid gap-2">
    Classic mode has 2 game mode variations:

    <ul class="list-disc list-inside">
      <li>4 letters word with 5 guesses</li>
      <li>5 letters word with 6 guesses</li>
    </ul>
  </div>

  <p>
    Unlike the original game, you can enter any sequence of letters.
    <span class="text-neutral-400">(may change later)</span>
  </p>

  <hr class="border-2 rounded-full border-current-800">

  <p class="text-xl">
    Example:
  </p>

  <div class="flex flex-col gap-8">
    <WordContainer>
      <WordLetter :tw-class="letterClassName.exact">
        c
      </WordLetter>
      <WordLetter>o</WordLetter>
      <WordLetter>s</WordLetter>
      <WordLetter>y</WordLetter>
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
      <WordLetter :tw-class="letterClassName.partial">
        d
      </WordLetter>
      <WordLetter>e</WordLetter>
      <WordLetter>m</WordLetter>
      <WordLetter>o</WordLetter>
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

    <p>
      If letter appears in the word multiple times,
      the number of times it appears will be shown next to the letter in the keyboard.
    </p>
  </div>
</template>
