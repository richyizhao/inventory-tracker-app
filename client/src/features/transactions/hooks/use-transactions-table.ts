import { useTableControls } from "@/hooks/use-table-controls"
import { useTransactionsList } from "@/features/transactions/hooks/use-transactions-list"
import type { TransactionSort } from "@/features/transactions/types/transactions"

export function useTransactionsTable() {
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
  } = useTableControls<TransactionSort, { selectedType: string }>({
    initialSort: "newest",
    initialFilters: {
      selectedType: "all types",
    },
  })
  const { selectedType } = filters
  const { loadState } = useTransactionsList({
    page,
    pageSize,
    search,
    selectedSort,
    selectedType,
    setPage,
  })

  return {
    loadState,
    pageSize,
    search,
    selectedSort,
    selectedType,
    setPage,
    setPageSize,
    setSearch,
    setSelectedSort,
    setSelectedType: (value: string) => setFilter("selectedType", value),
  }
}
