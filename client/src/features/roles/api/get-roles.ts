import { apiRequest } from "@/lib/api"
import type { RoleRow } from "@/features/roles/types/roles"

type GetRolesResponse = Array<{
  id: number
  name: string
  totalAssignedUsers: number
  totalPermissions: number
  createdAtUtc: string
  updatedAtUtc: string | null
  permissions: Array<{
    page: RoleRow["permissions"][number]["page"]
    canView: boolean
    canEdit: boolean
  }>
}>

export async function getRoles(token: string) {
  const roles = await apiRequest<GetRolesResponse>("/roles", { token })

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    totalPermissions: role.totalPermissions,
    totalUsersAssigned: role.totalAssignedUsers,
    createdAtUtc: role.createdAtUtc,
    updatedAtUtc: role.updatedAtUtc,
    permissions: role.permissions,
  })) satisfies RoleRow[]
}
