import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"
import type { ProfitSpendingPoint } from "@/features/analytics/types/analytics"
import { apiRequest } from "@/lib/api"

export function getProfitSpendingOverTime(
  range: AnalyticsRangeLabel,
  token: string
) {
  const searchParams = new URLSearchParams({ range })

  return apiRequest<ProfitSpendingPoint[]>(
    `/analytics/profit-spending-over-time?${searchParams.toString()}`,
    { token }
  )
}
