import { useMutation, useQueryClient, QueryClient, Updater, useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import type { User } from "@/server/db/schema"

export const useUser = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const { data: response, error } = await client.api.auth.me.get()

      if (error) {
        throw new Error(error.message)
      }

      return response
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
      const { data: response, error } = await client.api.auth.signin.post(data)

      if (error) {
        throw new Error(error.message)
      }

      return response.data
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
      const { data: response, error } = await client.api.auth.signup.post(data)

      if (error) {
        throw new Error(error.message)
      }

      return response.data
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
