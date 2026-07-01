import { Pagination } from "@/components/custom/pagination"

export function UsersTablePagination({
  hasNextPage,
  hasPreviousPage,
  page,
  pageSize,
  setPage,
  setPageSize,
  totalItems,
  totalPages,
  visibleUsersCount,
}: {
  hasNextPage: boolean
  hasPreviousPage: boolean
  page: number
  pageSize: number
  setPage: (value: number | ((currentValue: number) => number)) => void
  setPageSize: (value: number) => void
  totalItems: number
  totalPages: number
  visibleUsersCount: number
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
      visibleItemsCount={visibleUsersCount}
      itemLabel="users"
      rowsPerPageId="users-rows-per-page"
    />
  )
}
