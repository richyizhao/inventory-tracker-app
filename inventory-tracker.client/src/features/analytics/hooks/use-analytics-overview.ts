import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  type AnalyticsRange,
} from "@/features/analytics/api/analytics-api";
import {
  analyticsKeys,
  emptyAnalyticsOverview,
  getAnalyticsOverviewQueryOptions,
} from "@/features/analytics/api/analytics-queries";

export function useAnalyticsOverview(defaultRange: AnalyticsRange = "6M") {
  const { token } = useAuth();
  const [range, setRange] = useState<AnalyticsRange>(defaultRange);
  const overviewQuery = useQuery({
    ...(token
      ? getAnalyticsOverviewQueryOptions(token, range)
      : {
          queryKey: analyticsKeys.overview(range),
          queryFn: async () => emptyAnalyticsOverview,
        }),
    enabled: Boolean(token),
  });

  return {
    range,
    error: overviewQuery.error instanceof Error ? overviewQuery.error.message : null,
    isLoading: overviewQuery.isLoading,
    overview: token ? (overviewQuery.data ?? emptyAnalyticsOverview) : null,
    setRange,
  };
}
