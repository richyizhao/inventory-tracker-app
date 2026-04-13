import { queryOptions } from "@tanstack/react-query";

import {
  getProducts,
  getTransaction,
  getTransactions,
  type ProductOption,
  type Transaction,
} from "@/features/transactions/api/transactions-api";
import { queryKeyFactory } from "@/lib/react-query";

export const transactionKeys = {
  all: () => queryKeyFactory(["transactions"] as const),
  list: () => queryKeyFactory([...transactionKeys.all(), "list"] as const),
  detail: (transactionId: string) =>
    queryKeyFactory([...transactionKeys.all(), "detail", transactionId] as const),
  products: () =>
    queryKeyFactory([...transactionKeys.all(), "products"] as const),
};

export function getTransactionProductsQueryOptions(token: string) {
  return queryOptions({
    queryKey: transactionKeys.products(),
    queryFn: () => getProducts(token),
  });
}

export function getTransactionsQueryOptions(token: string) {
  return queryOptions({
    queryKey: transactionKeys.list(),
    queryFn: () => getTransactions(token),
  });
}

export function getTransactionDetailQueryOptions(
  token: string,
  transactionId: string,
) {
  return queryOptions({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => getTransaction(token, transactionId),
  });
}

export async function emptyTransactionProductsQuery(): Promise<ProductOption[]> {
  return [];
}

export async function emptyTransactionsQuery(): Promise<Transaction[]> {
  return [];
}
