import { apiRequest } from "@/lib/api"
import type { RolePermission } from "@/features/roles/types/roles"

export function updateRole(
  {
    id,
    name,
    permissions,
  }: {
    id: number
    name: string
    permissions: RolePermission[]
  },
  token: string
) {
  return apiRequest<void>("/roles", {
    method: "PUT",
    body: {
      id,
      name,
      permissions: permissions.map((permission) => ({
        page: permission.page,
        canView: permission.canView,
        canEdit: permission.canEdit,
      })),
    },
    token,
  })
}
