import { apiRequest } from "@/lib/api"

export function deleteUser(id: number, token: string) {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
    token,
  })
}
