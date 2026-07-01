import { apiRequest } from "@/lib/api"

export function deleteTransaction(id: number, token: string) {
  return apiRequest<void>(`/transactions/${id}`, {
    method: "DELETE",
    token,
  })
}
