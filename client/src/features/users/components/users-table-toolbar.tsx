import { ALL_ROLES_FILTER_VALUE } from "@/config/app-config"
import { FilterSelect } from "@/components/custom/filter-select"
import { SearchInput } from "@/components/custom/search-input"
import { Toolbar } from "@/components/custom/toolbar"
import type { UserRoleOption } from "@/features/roles/types/roles"
import type { UserSort } from "@/features/users/types/users"

export function UsersTableToolbar({
  roles,
  search,
  selectedRoleName,
  selectedSort,
  setSearch,
  setSelectedRoleName,
  setSelectedSort,
}: {
  roles: UserRoleOption[]
  search: string
  selectedRoleName: string
  selectedSort: UserSort
  setSearch: (value: string) => void
  setSelectedRoleName: (value: string) => void
  setSelectedSort: (value: UserSort) => void
}) {
  return (
    <Toolbar
      search={
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search display name, username, or email"
        />
      }
      filters={
        <>
          <FilterSelect
          value={selectedRoleName}
          onChange={setSelectedRoleName}
          placeholder="Filter by role"
          options={[
            { label: "All roles", value: ALL_ROLES_FILTER_VALUE },
            ...roles.map((role) => ({
              label: role.name,
              value: role.name,
            })),
          ]}
        />
        <FilterSelect
          value={selectedSort}
          onChange={(value) => {
            if (value === "newest" || value === "updated") {
              setSelectedSort(value)
            }
          }}
          placeholder="Sort users"
          triggerClassName="w-full sm:w-52"
          options={[
            { label: "latest created", value: "newest" },
            { label: "latest updated", value: "updated" },
          ]}
        />
      </>
      }
    />
  )
}
