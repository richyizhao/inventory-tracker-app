import { apiRequest } from "@/lib/api"

export function updateTransaction(
  request: {
    id: number
    productId: number
    userId: number
    type: number
    productQuantityChanged: number
    unitProductCost: number
    note?: string
  },
  token: string
) {
  return apiRequest<void>("/transactions", {
    method: "PUT",
    body: request,
    token,
  })
}
