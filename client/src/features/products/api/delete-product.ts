import { apiRequest } from "@/lib/api"

export function deleteProduct(id: number, token: string) {
  return apiRequest<void>(`/products/${id}`, {
    method: "DELETE",
    token,
  })
}
