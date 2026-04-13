import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  dashboardKeys,
  emptyDashboardSummary,
  getDashboardSummaryQueryOptions,
} from "@/features/dashboard/api/get-dashboard-summary";

export function useDashboardSummary() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const recentTransactionsLimit = 9;

  const summaryQuery = useQuery({
    ...(token
      ? getDashboardSummaryQueryOptions({
          token,
          recentTransactionsLimit,
        })
      : {
          queryKey: dashboardKeys.summary(recentTransactionsLimit),
          queryFn: async () => emptyDashboardSummary,
        }),
    enabled: Boolean(token),
  });

  async function refreshSummary() {
    if (!token) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: dashboardKeys.all(),
    });
  }

  return {
    error: summaryQuery.error instanceof Error ? summaryQuery.error.message : null,
    isLoading: summaryQuery.isLoading,
    refreshSummary,
    summary: summaryQuery.data ?? emptyDashboardSummary,
  };
}
