import type { Transaction } from "@/features/transactions/api/transactions-api";

export type TransactionFormState = {
  productId: string;
  type: "In" | "Out" | "Adjustment";
  quantity: string;
  unitCost: string;
  expenseAmount: string;
  reason: string;
  note: string;
};

export const TRANSACTION_REASONS = [
  "Restock",
  "Sale",
  "Return",
  "Damage",
  "Correction",
  "Transfer",
] as const;

function normalizeTransactionType(type: string): "In" | "Out" | "Adjustment" {
  switch (type.toLowerCase()) {
    case "in":
      return "In";
    case "out":
      return "Out";
    default:
      return "Adjustment";
  }
}

export function createTransactionFormState(
  transaction: Transaction | null,
): TransactionFormState {
  if (!transaction) {
    return {
      productId: "",
      type: "In",
      quantity: "1",
      unitCost: "",
      expenseAmount: "0",
      reason: "Restock",
      note: "",
    };
  }

  return {
    productId: transaction.productId,
    type: normalizeTransactionType(transaction.type),
    quantity: String(transaction.quantity),
    unitCost: String(transaction.unitCost),
    expenseAmount: String(transaction.expenseAmount),
    reason: transaction.reason || "Restock",
    note: transaction.note,
  };
}
