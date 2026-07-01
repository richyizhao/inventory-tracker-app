import * as React from "react"

import { ALL_ROLES_FILTER_VALUE } from "@/config/app-config"
import { useRefreshableProtectedPagedLoad } from "@/hooks/use-refreshable-protected-paged-load"
import type { UserRoleOption } from "@/features/roles/types/roles"
import { getUsers } from "@/features/users/api/get-users"
import { USERS_REFRESH_EVENT } from "@/lib/refresh-events"
import type { UserSort } from "@/features/users/types/users"

export function useUsersList({
  page,
  pageSize,
  roles,
  search,
  selectedRoleName,
  selectedSort,
  setPage,
}: {
  page: number
  pageSize: number
  roles: UserRoleOption[]
  search: string
  selectedRoleName: string
  selectedSort: UserSort
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const deferredSearch = React.useDeferredValue(search)
  const loadUsers = React.useCallback(
    (token: string) => {
      const selectedRole = roles.find((role) => role.name === selectedRoleName)

      return getUsers({
        page,
        pageSize,
        roleId:
          selectedRoleName === ALL_ROLES_FILTER_VALUE
            ? undefined
            : selectedRole?.id,
        search: deferredSearch,
        sort: selectedSort,
        token,
      })
    },
    [deferredSearch, page, pageSize, roles, selectedRoleName, selectedSort]
  )

  const { loadState } = useRefreshableProtectedPagedLoad({
    errorMessage: "Failed to load users.",
    eventName: USERS_REFRESH_EVENT,
    itemKey: "users",
    load: loadUsers,
    resetPageDeps: [deferredSearch, selectedRoleName, selectedSort],
    setPage,
    unauthenticatedMessage: "You need to be signed in to view users.",
  })

  return {
    loadState,
  }
}
