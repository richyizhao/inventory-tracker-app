import { Table, type TableColumn } from "@/components/custom/table"
import { RoleTableActions } from "@/features/roles/components/role-table-actions"
import type { RoleRow } from "@/features/roles/types/roles"
import { formatExactDateTime, formatRelativeDateTime } from "@/lib/date-time"

export function RolesTableGrid({ roles }: { roles: RoleRow[] }) {
  const columns: TableColumn<RoleRow>[] = [
    {
      key: "name",
      header: "Role Name",
      cell: (role) => role.name,
    },
    {
      key: "permissions",
      header: "Total Permissions",
      cell: (role) => role.totalPermissions,
    },
    {
      key: "usersAssigned",
      header: "Total Users Assigned",
      cell: (role) => role.totalUsersAssigned,
    },
    {
      key: "createdAtUtc",
      header: "Created",
      cell: (role) => (
        <span title={formatExactDateTime(role.createdAtUtc)}>
          {formatRelativeDateTime(role.createdAtUtc)}
        </span>
      ),
    },
    {
      key: "updatedAtUtc",
      header: "Updated",
      cell: (role) => (
        <span title={formatExactDateTime(role.updatedAtUtc)}>
          {formatRelativeDateTime(role.updatedAtUtc)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cellClassName: "w-px",
      cell: (role) => <RoleTableActions role={role} />,
    },
  ]

  return (
    <Table
      data={roles}
      columns={columns}
      getRowKey={(role) => role.id}
      emptyMessage="No roles found."
    />
  )
}
