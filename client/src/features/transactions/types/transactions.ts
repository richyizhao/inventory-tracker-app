import type { PagedLoadState } from "@/types/load-state"
import type { PagedResponse } from "@/types/pagination"

export type TransactionTypeValue = "IN" | "OUT" | "ADJUSTMENT"

export type TransactionSort = "newest" | "updated"

export type Transaction = {
  id: number
  productId: number
  productName: string
  type: TransactionTypeValue
  productQuantityChanged: number
  unitProductCost: number
  totalProductCost: number
  userId: number
  username: string
  displayName: string
  note: string | null
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type TransactionFormValues = {
  selectedProductName: string
  selectedUsername: string
  type: TransactionTypeValue
  productQuantityChanged: string
  unitProductCost: string
  note: string
}

export type PagedTransactionsResponse = PagedResponse<Transaction>

export type TransactionsLoadState = PagedLoadState<Transaction, "transactions">
