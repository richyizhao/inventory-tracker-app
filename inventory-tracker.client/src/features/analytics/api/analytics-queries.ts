import { queryOptions } from "@tanstack/react-query";

import {
  getAnalyticsOverview,
  type AnalyticsOverview,
  type AnalyticsRange,
} from "@/features/analytics/api/analytics-api";
import { queryKeyFactory } from "@/lib/react-query";

export const analyticsKeys = {
  all: () => queryKeyFactory(["analytics"] as const),
  overview: (range: AnalyticsRange) =>
    queryKeyFactory([...analyticsKeys.all(), "overview", range] as const),
};

export const emptyAnalyticsOverview: AnalyticsOverview = {
  totalInventoryValue: 0,
  totalRestockSpend: 0,
  totalProfit: 0,
  spendingOverTime: [],
  profitOverTime: [],
  spendingByCategory: [],
  profitByCategory: [],
  inventoryValueDistribution: [],
};

export function getAnalyticsOverviewQueryOptions(
  token: string,
  range: AnalyticsRange,
) {
  return queryOptions({
    queryKey: analyticsKeys.overview(range),
    queryFn: () => getAnalyticsOverview(token, range),
  });
}
