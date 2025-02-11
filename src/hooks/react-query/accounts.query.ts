import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Account, AccountStatus } from "@/server/db/schema"

type AccountData = {
  serviceName: string
  startDate: string
  expirationDate: string
  maxUsers: number
  price: string
}

const queryKeys = {
  all: ["accounts"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters: { status?: string }) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
}

export const useAccountsQuery = (filters?: { status?: AccountStatus }) => {
  return useQuery({
    queryKey: queryKeys.list(filters ?? {}),
    queryFn: async () => {
      const res = await client.api.accounts.$get({
        query: {
          status: filters?.status,
        },
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
  })
}

export const useAccountQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: async () => {
      const res = await client.api.accounts[":accountId"].$get({ param: { accountId: id } })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AccountData) => {
      const res = await client.api.accounts.$post({ json: data })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AccountData> }) => {
      const res = await client.api.accounts[":accountId"].$patch({ param: { accountId: id }, json: data })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.accounts[":accountId"].$delete({ param: { accountId: id } })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
    },
  })
}
