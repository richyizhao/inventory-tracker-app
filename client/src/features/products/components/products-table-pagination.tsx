import { Pagination } from "@/components/custom/pagination"

export function ProductsTablePagination({
  hasNextPage,
  hasPreviousPage,
  page,
  pageSize,
  setPage,
  setPageSize,
  totalItems,
  totalPages,
  visibleProductsCount,
}: {
  hasNextPage: boolean
  hasPreviousPage: boolean
  page: number
  pageSize: number
  setPage: (value: number | ((currentValue: number) => number)) => void
  setPageSize: (value: number) => void
  totalItems: number
  totalPages: number
  visibleProductsCount: number
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
      visibleItemsCount={visibleProductsCount}
      itemLabel="products"
      rowsPerPageId="products-rows-per-page"
    />
  )
}
