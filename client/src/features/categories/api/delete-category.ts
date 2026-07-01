import { apiRequest } from "@/lib/api"

export function deleteCategory(id: number, token: string) {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
    token,
  })
}
