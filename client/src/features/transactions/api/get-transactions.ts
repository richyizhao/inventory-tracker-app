import { apiRequest } from "@/lib/api"
import type {
  PagedTransactionsResponse,
  TransactionSort,
  TransactionTypeValue,
} from "@/features/transactions/types/transactions"

type GetTransactionsOptions = {
  page?: number
  pageSize?: number
  search?: string
  sort?: TransactionSort
  type?: TransactionTypeValue
  token: string
}

export function getTransactions({
  page = 1,
  pageSize = 100,
  search,
  sort,
  type,
  token,
}: GetTransactionsOptions) {
  const searchParams = new URLSearchParams()

  searchParams.set("page", `${page}`)
  searchParams.set("pageSize", `${pageSize}`)

  if (search?.trim()) {
    searchParams.set("search", search.trim())
  }

  if (type) {
    searchParams.set("type", type)
  }

  if (sort) {
    searchParams.set("sort", sort)
  }

  return apiRequest<PagedTransactionsResponse>(
    `/transactions?${searchParams.toString()}`,
    {
      token,
    }
  )
}
