import { apiRequest } from "@/lib/api"
import type { UserRoleOption } from "@/features/roles/types/roles"

type GetRoleOptionsResponse = Array<{
  id: number
  name: string
}>

export async function getRoleOptions(token: string) {
  const roles = await apiRequest<GetRoleOptionsResponse>("/roles", { token })

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
  })) satisfies UserRoleOption[]
}
