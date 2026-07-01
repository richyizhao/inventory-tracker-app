import { apiRequest } from "@/lib/api"
import type { PagedProductsResponse, ProductSort } from "@/features/products/types/products"

type GetProductsOptions = {
  page?: number
  pageSize?: number
  categoryId?: number
  subCategoryId?: number
  search?: string
  sort?: ProductSort
  token: string
}

export function getProducts({
  page = 1,
  pageSize = 100,
  categoryId,
  subCategoryId,
  search,
  sort,
  token,
}: GetProductsOptions) {
  const searchParams = new URLSearchParams()

  searchParams.set("page", `${page}`)
  searchParams.set("pageSize", `${pageSize}`)

  if (search?.trim()) {
    searchParams.set("search", search.trim())
  }

  if (categoryId) {
    searchParams.set("categoryId", `${categoryId}`)
  }

  if (subCategoryId) {
    searchParams.set("subCategoryId", `${subCategoryId}`)
  }

  if (sort) {
    searchParams.set("sort", sort)
  }

  return apiRequest<PagedProductsResponse>(
    `/products?${searchParams.toString()}`,
    {
      token,
    }
  )
}
