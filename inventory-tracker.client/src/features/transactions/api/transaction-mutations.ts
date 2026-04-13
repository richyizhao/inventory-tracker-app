import { mutationOptions } from "@tanstack/react-query";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  type Transaction,
  type TransactionInput,
} from "@/features/transactions/api/transactions-api";

export function createTransactionMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (input: TransactionInput): Promise<Transaction> =>
      createTransaction(token, input),
  });
}

export function updateTransactionMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({
      transactionId,
      input,
    }: {
      transactionId: string;
      input: TransactionInput;
    }): Promise<Transaction> => updateTransaction(token, transactionId, input),
  });
}

export function deleteTransactionMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ transactionId }: { transactionId: string }) =>
      deleteTransaction(token, transactionId),
  });
}
