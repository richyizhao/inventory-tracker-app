import { request } from "@/lib/http";

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
  userEmail: string;
  note: string;
  createdAt: string;
};

export type DashboardSummary = {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  recentTransactions: Transaction[];
};

export function getDashboardSummary(
  token: string,
  recentTransactionsLimit: number,
) {
  return request<DashboardSummary>(
    `/Dashboard/summary?recentCount=${recentTransactionsLimit}`,
    {
      token,
    },
  );
}
