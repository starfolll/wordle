import type { TUserLoginData } from 'types.app'
import { trpcClient } from '@/api/trpcClient'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userData = ref<TUserLoginData | null>(null)

  const login = async () => {
    const loginData = await trpcClient.login.query()

    userData.value = {
      id: loginData.id,
      name: loginData.name,
      token: loginData.token,
    }
  }

  return {
    userData,

    login,
  }
})
