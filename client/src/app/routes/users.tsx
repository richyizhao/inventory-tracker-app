import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/common/list-shell"
import { UsersTableToolbar } from "@/features/users/components/users-table-toolbar"
import { UsersTableGrid } from "@/features/users/components/users-table-grid"
import { UsersTablePagination } from "@/features/users/components/users-table-pagination"
import { useUsersTable } from "@/features/users/hooks/use-users-table"

export const Route = createFileRoute("/users")({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    loadState,
    pageSize,
    roles,
    search,
    selectedRoleName,
    selectedSort,
    setPage,
    setPageSize,
    setSearch,
    setSelectedRoleName,
    setSelectedSort,
  } = useUsersTable()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading users..."
        errorTitle="Unable to load users"
      />
    )
  }

  const totalPages = Math.max(
    1,
    Math.ceil(loadState.totalItems / loadState.pageSize)
  )

  return (
    <ListShell
      loading={false}
      loadingText="Loading users..."
      errorTitle="Unable to load users"
      toolbar={
        <UsersTableToolbar
          roles={roles}
          search={search}
          selectedRoleName={selectedRoleName}
          selectedSort={selectedSort}
          setSearch={setSearch}
          setSelectedRoleName={setSelectedRoleName}
          setSelectedSort={setSelectedSort}
        />
      }
      footer={
        <UsersTablePagination
          hasNextPage={loadState.hasNextPage}
          hasPreviousPage={loadState.hasPreviousPage}
          page={loadState.page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      }
    >
      <UsersTableGrid users={loadState.users} />
    </ListShell>
  )
}
