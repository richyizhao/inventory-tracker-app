import { apiRequest } from "@/lib/api"

export function deleteRole(roleId: number, token: string) {
  return apiRequest<void>(`/roles/${roleId}`, {
    method: "DELETE",
    token,
  })
}
