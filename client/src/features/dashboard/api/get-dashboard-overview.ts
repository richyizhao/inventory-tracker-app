import type { DashboardOverviewResponse } from "@/features/dashboard/types/dashboard"
import { apiRequest } from "@/lib/api"

export function getDashboardOverview(token: string) {
  const searchParams = new URLSearchParams({
    lowStockProductsCount: "8",
    recentTransactionsCount: "5",
  })

  return apiRequest<DashboardOverviewResponse>(`/dashboard?${searchParams.toString()}`, {
    token,
  })
}
