import type { InventoryValueDistributionPoint } from "@/features/analytics/types/analytics"
import { apiRequest } from "@/lib/api"

export function getInventoryValueDistribution(token: string) {
  return apiRequest<InventoryValueDistributionPoint[]>("/analytics/inventory-value-distribution", {
    token,
  })
}
