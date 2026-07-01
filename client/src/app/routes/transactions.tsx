import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/custom/list-shell"
import { TransactionsTableToolbar } from "@/features/transactions/components/transactions-table-toolbar"
import { TransactionsTableGrid } from "@/features/transactions/components/transactions-table-grid"
import { TransactionsTablePagination } from "@/features/transactions/components/transactions-table-pagination"
import { useTransactionsTable } from "@/features/transactions/hooks/use-transactions-table"

export const Route = createFileRoute("/transactions")({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    loadState,
    pageSize,
    search,
    selectedSort,
    selectedType,
    setPage,
    setPageSize,
    setSearch,
    setSelectedSort,
    setSelectedType,
  } = useTransactionsTable()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading transactions..."
        errorTitle="Unable to load transactions"
      />
    )
  }

  const totalPages = Math.max(1, Math.ceil(loadState.totalItems / loadState.pageSize))

  return (
    <ListShell
      loading={false}
      loadingText="Loading transactions..."
      errorTitle="Unable to load transactions"
      toolbar={
        <TransactionsTableToolbar
          search={search}
          selectedSort={selectedSort}
          selectedType={selectedType}
          setSearch={setSearch}
          setSelectedSort={setSelectedSort}
          setSelectedType={setSelectedType}
        />
      }
      footer={
        <TransactionsTablePagination
          hasNextPage={loadState.hasNextPage}
          hasPreviousPage={loadState.hasPreviousPage}
          page={loadState.page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          totalItems={loadState.totalItems}
          totalPages={totalPages}
          visibleTransactionsCount={loadState.transactions.length}
        />
      }
    >
      <TransactionsTableGrid transactions={loadState.transactions} />
    </ListShell>
  )
}
