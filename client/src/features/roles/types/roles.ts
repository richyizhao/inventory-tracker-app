export type PermissionPage = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type UserRoleOption = {
  id: number
  name: string
}

export type RolePermission = {
  page: PermissionPage
  canView: boolean
  canEdit: boolean
}

export type RoleFormValues = {
  name: string
  permissions: RolePermission[]
}

export type RoleRow = {
  id: number
  name: string
  totalPermissions: number
  totalUsersAssigned: number
  createdAtUtc: string | null
  updatedAtUtc: string | null
  permissions: RolePermission[]
}
