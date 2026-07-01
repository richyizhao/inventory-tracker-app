import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"
import type { RestockExpenseByCategoryPoint } from "@/features/analytics/types/analytics"
import { apiRequest } from "@/lib/api"

export function getRestockExpenseByCategory(
  range: AnalyticsRangeLabel,
  token: string
) {
  const searchParams = new URLSearchParams({ range })

  return apiRequest<RestockExpenseByCategoryPoint[]>(
    `/analytics/restock-expense-by-category?${searchParams.toString()}`,
    { token }
  )
}
