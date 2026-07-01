import { apiRequest } from "@/lib/api"

export function deleteSubCategory(id: number, token: string) {
  return apiRequest<void>(`/categories/subcategories/${id}`, {
    method: "DELETE",
    token,
  })
}
