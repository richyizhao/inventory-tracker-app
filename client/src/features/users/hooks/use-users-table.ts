import { ALL_ROLES_FILTER_VALUE } from "@/config/app-config"
import { useTableControls } from "@/hooks/use-table-controls"
import { useUserRoleOptions } from "@/features/users/hooks/use-user-role-options"
import { useUsersList } from "@/features/users/hooks/use-users-list"
import type { UserSort } from "@/features/users/types/users"

export function useUsersTable() {
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
  } = useTableControls<UserSort, { selectedRoleName: string }>({
    initialSort: "newest",
    initialFilters: {
      selectedRoleName: ALL_ROLES_FILTER_VALUE,
    },
  })
  const { selectedRoleName } = filters
  const { roles } = useUserRoleOptions()
  const { loadState } = useUsersList({
    page,
    pageSize,
    roles,
    search,
    selectedRoleName,
    selectedSort,
    setPage,
  })

  return {
    loadState,
    pageSize,
    roles,
    search,
    selectedRoleName,
    selectedSort,
    setPage,
    setPageSize,
    setSearch,
    setSelectedRoleName: (value: string) => setFilter("selectedRoleName", value),
    setSelectedSort,
  }
}
