import { apiRequest } from "@/lib/api"

type CreateTransactionResponse = {
  id: number
}

export function createTransaction(
  request: {
    productId: number
    userId: number
    type: number
    productQuantityChanged: number
    unitProductCost: number
    note?: string
  },
  token: string
) {
  return apiRequest<CreateTransactionResponse>("/transactions", {
    method: "POST",
    body: request,
    token,
  })
}
