import {
  editWithoutViewWarningMessage,
  rolePermissionPageOptions,
} from "@/features/roles/lib/role-config"
import type { RolePermission } from "@/features/roles/types/roles"

export function normalizeRolePermissions(permissions: RolePermission[]) {
  const permissionMap = new Map(
    permissions.map((permission) => [permission.page, permission])
  )

  return rolePermissionPageOptions.map(({ page }) => {
    const permission = permissionMap.get(page)

    return {
      page,
      canView: permission?.canView ?? false,
      canEdit: permission?.canEdit ?? false,
    } satisfies RolePermission
  })
}

export function hasEditWithoutViewPermission(permissions: RolePermission[]) {
  return permissions.some(
    (permission) => permission.canEdit && !permission.canView
  )
}

export function getEditWithoutViewWarningMessage() {
  return editWithoutViewWarningMessage
}
