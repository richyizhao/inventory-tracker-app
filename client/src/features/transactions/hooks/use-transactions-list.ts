import * as React from "react"

import { useRefreshableProtectedPagedLoad } from "@/hooks/use-refreshable-protected-paged-load"
import { getTransactions } from "@/features/transactions/api/get-transactions"
import { TRANSACTIONS_REFRESH_EVENT } from "@/lib/refresh-events"
import type {
  TransactionSort,
  TransactionTypeValue,
} from "@/features/transactions/types/transactions"

export function useTransactionsList({
  page,
  pageSize,
  search,
  selectedSort,
  selectedType,
  setPage,
}: {
  page: number
  pageSize: number
  search: string
  selectedSort: TransactionSort
  selectedType: string
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const deferredSearch = React.useDeferredValue(search)
  const loadTransactions = React.useCallback((token: string) => {
    return getTransactions({
      page,
      pageSize,
      search: deferredSearch,
      sort: selectedSort,
      type:
        selectedType === "all types"
          ? undefined
          : (selectedType as TransactionTypeValue),
      token,
    })
  }, [
    deferredSearch,
    page,
    pageSize,
    selectedSort,
    selectedType,
  ])

  const { loadState } = useRefreshableProtectedPagedLoad({
    errorMessage: "Failed to load transactions.",
    eventName: TRANSACTIONS_REFRESH_EVENT,
    itemKey: "transactions",
    load: loadTransactions,
    resetPageDeps: [deferredSearch, selectedSort, selectedType],
    setPage,
    unauthenticatedMessage: "You need to be signed in to view transactions.",
  })

  return {
    loadState,
  }
}
