import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"

type SignInData = {
  email: string
  password: string
}

type SignUpData = SignInData & {
  name: string
}

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: SignInData) => {
      const { data: response, error } = await client.api.auth.signin.post(data)

      if (error) {
        throw new Error(error.message)
      }

      return response
    },
  })
}

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const { data: response, error } = await client.api.auth.signup.post(data)

      if (error) {
        throw new Error(error.message)
      }

      return response
    },
  })
}
