import { queryOptions } from "@tanstack/react-query";

import {
  getDashboardSummary,
  type DashboardSummary,
} from "@/features/dashboard/api/dashboard-api";
import { queryKeyFactory } from "@/lib/react-query";

export const dashboardKeys = {
  all: () => queryKeyFactory(["dashboard"] as const),
  summary: (recentTransactionsLimit: number) =>
    queryKeyFactory(
      [...dashboardKeys.all(), "summary", recentTransactionsLimit] as const,
    ),
};

type GetDashboardSummaryQueryOptionsParams = {
  token: string;
  recentTransactionsLimit: number;
};

export const emptyDashboardSummary: DashboardSummary = {
  totalProducts: 0,
  totalStock: 0,
  lowStockCount: 0,
  recentTransactions: [],
};

export function getDashboardSummaryQueryOptions({
  token,
  recentTransactionsLimit,
}: GetDashboardSummaryQueryOptionsParams) {
  return queryOptions({
    queryKey: dashboardKeys.summary(recentTransactionsLimit),
    queryFn: () => getDashboardSummary(token, recentTransactionsLimit),
  });
}
