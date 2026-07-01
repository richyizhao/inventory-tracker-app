import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"
import type { ProfitByCategoryPoint } from "@/features/analytics/types/analytics"
import { apiRequest } from "@/lib/api"

export function getProfitByCategory(range: AnalyticsRangeLabel, token: string) {
  const searchParams = new URLSearchParams({ range })

  return apiRequest<ProfitByCategoryPoint[]>(
    `/analytics/profit-by-category?${searchParams.toString()}`,
    { token }
  )
}
