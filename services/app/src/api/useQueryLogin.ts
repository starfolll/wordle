import { useQuery } from '@tanstack/vue-query'
import { trpcClient } from './trpcClient'

export function useQueryLogin() {
  return useQuery({
    queryKey: ['userLoginData'],
    queryFn: () => trpcClient.login.query(),
    staleTime: Infinity,
  })
}
