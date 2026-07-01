import { Pagination } from "@/components/common/pagination"

export function ProductsTablePagination({
  hasNextPage,
  hasPreviousPage,
  page,
  pageSize,
  setPage,
  setPageSize,
  totalPages,
}: {
  hasNextPage: boolean
  hasPreviousPage: boolean
  page: number
  pageSize: number
  setPage: (value: number | ((currentValue: number) => number)) => void
  setPageSize: (value: number) => void
  totalPages: number
}) {
  return (
    <Pagination
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      totalPages={totalPages}
      rowsPerPageId="products-rows-per-page"
    />
  )
}
