import type { Product } from "@/features/products/types/products"
import type { User } from "@/features/users/types/users"
import type {
  Transaction,
  TransactionFormValues,
  TransactionTypeValue,
} from "@/features/transactions/types/transactions"

export const transactionTypeOptions: Array<{
  label: string
  value: TransactionTypeValue
}> = [
  { label: "Stock in", value: "IN" },
  { label: "Stock out", value: "OUT" },
  { label: "Adjustment", value: "ADJUSTMENT" },
]

export function createEmptyTransactionFormValues(): TransactionFormValues {
  return {
    selectedProductName: "",
    selectedUsername: "",
    type: "IN",
    productQuantityChanged: "1",
    unitProductCost: "0",
    note: "",
  }
}

export function createTransactionFormValuesFromTransaction(
  transaction: Transaction
): TransactionFormValues {
  return {
    selectedProductName: transaction.productName,
    selectedUsername: transaction.username,
    type: transaction.type,
    productQuantityChanged: `${transaction.productQuantityChanged}`,
    unitProductCost: `${transaction.unitProductCost}`,
    note: transaction.note ?? "",
  }
}

export function findSelectedTransactionProduct({
  products,
  selectedProductName,
}: {
  products: Product[]
  selectedProductName: string
}) {
  return products.find((product) => product.name === selectedProductName)
}

export function findSelectedTransactionUser({
  selectedUsername,
  users,
}: {
  selectedUsername: string
  users: User[]
}) {
  return users.find((user) => user.username === selectedUsername)
}

export function toTransactionTypeApiValue(type: TransactionTypeValue) {
  switch (type) {
    case "IN":
      return 1
    case "OUT":
      return 2
    case "ADJUSTMENT":
      return 3
  }
}
