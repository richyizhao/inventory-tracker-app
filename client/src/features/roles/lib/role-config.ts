import type { PermissionPage } from "@/features/roles/types/roles"

export const rolePermissionPageOptions: Array<{
  page: PermissionPage
  label: string
}> = [
  { page: 1, label: "Dashboard" },
  { page: 2, label: "Analytics" },
  { page: 3, label: "Categories" },
  { page: 4, label: "Products" },
  { page: 5, label: "Transactions" },
  { page: 6, label: "Users" },
  { page: 7, label: "Roles" },
]

export const editWithoutViewWarningMessage =
  "A page cannot Edit without View permission."
