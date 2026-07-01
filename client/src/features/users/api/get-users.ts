import { apiRequest } from "@/lib/api"
import type { PagedUsersResponse } from "@/features/users/types/users"

type GetUsersOptions = {
  page?: number
  pageSize?: number
  roleId?: number
  search?: string
  sort?: "newest" | "updated"
  token: string
}

export function getUsers({
  page = 1,
  pageSize = 100,
  roleId,
  search,
  sort,
  token,
}: GetUsersOptions) {
  const searchParams = new URLSearchParams()

  searchParams.set("page", `${page}`)
  searchParams.set("pageSize", `${pageSize}`)

  if (search?.trim()) {
    searchParams.set("search", search.trim())
  }

  if (roleId) {
    searchParams.set("roleId", `${roleId}`)
  }

  if (sort) {
    searchParams.set("sort", sort)
  }

  return apiRequest<PagedUsersResponse>(`/users?${searchParams.toString()}`, {
    token,
  })
}
