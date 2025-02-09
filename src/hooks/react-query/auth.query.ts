import { useMutation, useQueryClient, QueryClient, Updater, useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import type { User } from "@/server/db/schema"

export const useUser = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const resp = await client.api.auth.me.$get()
      return await resp.json()
    },
  })
}

useUser.queryKey = () => ["auth", "user"]

useUser.invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: useUser.queryKey(),
  })
}

type SignInData = {
  email: string
  password: string
}
export const useSignInMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignInData) => {
      const resp = await client.api.auth.signin.$post({
        json: data,
      })

      return resp.json()
    },
  })
}

useSignInMutation.queryKey = () => ["auth", "signin"]

useSignInMutation.invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: useSignInMutation.queryKey(),
  })
}

type SignUpData = SignInData & {
  name: string
}

export const useSignUpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const resp = await client.api.auth.signup.$post({
        json: data,
      })

      return resp.json()
    },
  })
}

useSignUpMutation.queryKey = () => ["auth", "signup"]

useSignUpMutation.invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: useSignUpMutation.queryKey(),
  })
}

useSignUpMutation.setData = (queryClient: QueryClient, data: Updater<User | null, User | null>) => {
  queryClient.setQueryData(useSignUpMutation.queryKey(), data)
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const resp = await client.api.auth.signout.$post()
      return resp.json()
    },
  })
}

useLogoutMutation.queryKey = () => ["auth", "logout"]

useLogoutMutation.invalidate = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: useLogoutMutation.queryKey(),
  })
}
