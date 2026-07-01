import { apiRequest } from "@/lib/api"
import type { RolePermission } from "@/features/roles/types/roles"

type CreateRoleResponse = {
  id: number
}

export function createRole(
  {
    name,
    permissions,
  }: {
    name: string
    permissions: RolePermission[]
  },
  token: string
) {
  return apiRequest<CreateRoleResponse>("/roles", {
    method: "POST",
    body: {
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
