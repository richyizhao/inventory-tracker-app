import * as React from "react"

export function useTableControls<
  TSort extends string,
  TFilters extends Record<string, string>,
>({
  initialFilters,
  initialSort,
  initialPage = 1,
  initialPageSize = 10,
}: {
  initialFilters: TFilters
  initialSort: TSort
  initialPage?: number
  initialPageSize?: number
}) {
  const [page, setPage] = React.useState(initialPage)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [search, setSearch] = React.useState("")
  const [selectedSort, setSelectedSort] = React.useState<TSort>(initialSort)
  const [filters, setFilters] = React.useState<TFilters>(initialFilters)

  const setFilter = React.useCallback(function setFilter<TKey extends keyof TFilters>(
    key: TKey,
    value: TFilters[TKey]
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }, [])

  return {
    filters,
    page,
    pageSize,
    search,
    selectedSort,
    setFilter,
    setFilters,
    setPage,
    setPageSize,
    setSearch,
    setSelectedSort,
  }
}
