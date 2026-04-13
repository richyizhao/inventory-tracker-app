import { request } from "@/lib/http";

export type ProductOption = {
  id: string;
  name: string;
  sku: string;
  unitCost: number;
};

export type Transaction = {
  id: string;
  productId: string;
  productName: string;
  type: "In" | "Out" | "Adjustment" | string;
  quantity: number;
  unitCost: number;
  expenseAmount: number;
  totalCost: number;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  note: string;
  createdAt: string;
};

export type TransactionInput = {
  productId: string;
  type: "In" | "Out" | "Adjustment";
  quantity: number;
  reason: string;
  note: string;
  unitCost?: number;
  expenseAmount?: number;
};

type PagedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

function withQuery(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export async function getProducts(token: string) {
  const response = await request<PagedResult<ProductOption>>(
    withQuery("/Products", { page: 1, limit: 100, sort: "name:asc" }),
    { token },
  );

  return response.items;
}

export function getTransactions(token: string) {
  return request<Transaction[]>("/Transactions", { token });
}

export function getTransaction(token: string, transactionId: string) {
  return request<Transaction>(`/Transactions/${transactionId}`, { token });
}

export function createTransaction(
  token: string,
  input: TransactionInput,
) {
  return request<Transaction>("/Transactions", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateTransaction(
  token: string,
  transactionId: string,
  input: TransactionInput,
) {
  return request<Transaction>(`/Transactions/${transactionId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteTransaction(token: string, transactionId: string) {
  return request<void>(`/Transactions/${transactionId}`, {
    method: "DELETE",
    token,
  });
}
