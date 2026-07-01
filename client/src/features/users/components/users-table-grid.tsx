import { Table } from "@/components/common/table"
import type { TableColumn } from "@/components/common/table"
import { UserTableActions } from "@/features/users/components/user-table-actions"
import type { User } from "@/features/users/types/users"
import { formatExactDateTime, formatRelativeDateTime } from "@/lib/date-time"

export function UsersTableGrid({ users }: { users: User[] }) {
  const columns: TableColumn<User>[] = [
    {
      key: "displayName",
      header: "Display Name",
      cell: (user) => user.displayName,
    },
    {
      key: "username",
      header: "Username",
      cell: (user) => user.username,
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => user.email,
    },
    {
      key: "roleName",
      header: "Role",
      cell: (user) => user.roleName,
    },
    {
      key: "createdAtUtc",
      header: "Created",
      cell: (user) => (
        <span title={formatExactDateTime(user.createdAtUtc)}>
          {formatRelativeDateTime(user.createdAtUtc)}
        </span>
      ),
    },
    {
      key: "updatedAtUtc",
      header: "Updated",
      cell: (user) => (
        <span title={formatExactDateTime(user.updatedAtUtc)}>
          {formatRelativeDateTime(user.updatedAtUtc)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cellClassName: "w-px",
      cell: (user) => <UserTableActions user={user} />,
    },
  ]

  return (
    <Table
      data={users}
      columns={columns}
      getRowKey={(user) => user.id}
      emptyMessage="No users found."
    />
  )
}
