import * as React from "react"

import {
  ALL_CATEGORIES_FILTER_VALUE,
  ALL_SUB_CATEGORIES_FILTER_VALUE,
} from "@/config/app-config"
import { useRefreshableProtectedPagedLoad } from "@/hooks/use-refreshable-protected-paged-load"
import { getProducts } from "@/features/products/api/get-products"
import { PRODUCTS_REFRESH_EVENT } from "@/lib/refresh-events"
import type { Category } from "@/features/categories/types/categories"
import type { ProductSort } from "@/features/products/types/products"

export function useProductsList({
  categories,
  page,
  pageSize,
  search,
  selectedCategoryName,
  selectedSubCategoryKey,
  selectedSort,
  setPage,
}: {
  categories: Category[]
  page: number
  pageSize: number
  search: string
  selectedCategoryName: string
  selectedSubCategoryKey: string
  selectedSort: ProductSort
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const deferredSearch = React.useDeferredValue(search)
  const loadProducts = React.useCallback(
    (token: string) => {
      const selectedCategory = categories.find(
        (category) => category.name === selectedCategoryName
      )
      const selectedSubCategoryId =
        selectedSubCategoryKey === ALL_SUB_CATEGORIES_FILTER_VALUE
          ? undefined
          : Number(selectedSubCategoryKey.split(":")[0])

      return getProducts({
        page,
        pageSize,
        categoryId:
          selectedCategoryName === ALL_CATEGORIES_FILTER_VALUE
            ? undefined
            : selectedCategory?.id,
        subCategoryId: selectedSubCategoryId,
        search: deferredSearch,
        sort: selectedSort,
        token,
      })
    },
    [
      categories,
      deferredSearch,
      page,
      pageSize,
      selectedCategoryName,
      selectedSubCategoryKey,
      selectedSort,
    ]
  )

  const { loadState } = useRefreshableProtectedPagedLoad({
    errorMessage: "Failed to load products.",
    eventName: PRODUCTS_REFRESH_EVENT,
    itemKey: "products",
    load: loadProducts,
    resetPageDeps: [
      deferredSearch,
      selectedCategoryName,
      selectedSort,
      selectedSubCategoryKey,
    ],
    setPage,
    unauthenticatedMessage: "You need to be signed in to view products.",
  })

  return {
    loadState,
  }
}
