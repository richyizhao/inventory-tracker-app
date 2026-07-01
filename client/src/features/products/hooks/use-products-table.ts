import * as React from "react"

import {
  ALL_CATEGORIES_FILTER_VALUE,
  ALL_SUB_CATEGORIES_FILTER_VALUE,
} from "@/config/app-config"
import { useTableControls } from "@/hooks/use-table-controls"
import { useProductCategories } from "@/features/products/hooks/use-product-categories"
import { useProductsList } from "@/features/products/hooks/use-products-list"
import type { ProductSort } from "@/features/products/types/products"

export function useProductsTable() {
  const {
    filters,
    page,
    pageSize,
    search,
    selectedSort,
    setFilter,
    setPage,
    setPageSize,
    setSearch,
    setSelectedSort,
  } = useTableControls<
    ProductSort,
    {
      selectedCategoryName: string
      selectedSubCategoryKey: string
    }
  >({
    initialSort: "newest",
    initialFilters: {
      selectedCategoryName: ALL_CATEGORIES_FILTER_VALUE,
      selectedSubCategoryKey: ALL_SUB_CATEGORIES_FILTER_VALUE,
    },
  })
  const { categories, categoriesError, isLoadingCategories } = useProductCategories()
  const { selectedCategoryName, selectedSubCategoryKey } = filters

  React.useEffect(() => {
    setFilter("selectedSubCategoryKey", ALL_SUB_CATEGORIES_FILTER_VALUE)
  }, [selectedCategoryName, setFilter])

  const { loadState } = useProductsList({
    categories,
    page,
    pageSize,
    search,
    selectedCategoryName,
    selectedSubCategoryKey,
    selectedSort,
    setPage,
  })

  return {
    categories,
    categoriesError,
    isLoadingCategories,
    loadState,
    pageSize,
    search,
    selectedCategoryName,
    selectedSubCategoryKey,
    selectedSort,
    setPage,
    setPageSize,
    setSearch,
    setSelectedCategoryName: (value: string) =>
      setFilter("selectedCategoryName", value),
    setSelectedSubCategoryKey: (value: string) =>
      setFilter("selectedSubCategoryKey", value),
    setSelectedSort,
  }
}
