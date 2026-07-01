import { Pagination } from "@/components/custom/pagination"

export function TransactionsTablePagination({
  hasNextPage,
  hasPreviousPage,
  page,
  pageSize,
  setPage,
  setPageSize,
  totalItems,
  totalPages,
  visibleTransactionsCount,
}: {
  hasNextPage: boolean
  hasPreviousPage: boolean
  page: number
  pageSize: number
  setPage: (value: number | ((currentValue: number) => number)) => void
  setPageSize: (value: number) => void
  totalItems: number
  totalPages: number
  visibleTransactionsCount: number
}) {
  return (
    <Pagination
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      visibleItemsCount={visibleTransactionsCount}
      itemLabel="transactions"
      rowsPerPageId="transactions-rows-per-page"
    />
  )
}
