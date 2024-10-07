import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const language = 'en'

  return {
    language,
  }
})
