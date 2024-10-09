import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBankStore = defineStore('bank', () => {
  const coins = ref(0)

  return {
    coins,
  }
})
