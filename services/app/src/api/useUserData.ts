import { useQuery } from '@tanstack/vue-query'
import { trpcClient } from './trpcClient'

export async function useUserData() {
  console.log(await trpcClient.login.query())
  console.log(await trpcClient.getDailyChallengeProcedure.query())

  return {}
}
