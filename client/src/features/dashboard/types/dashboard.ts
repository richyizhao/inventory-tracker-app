export type DashboardInventoryMovementPoint = {
  date: string
  stockIn: number
  stockOut: number
}

export type DashboardLowStockProduct = {
  id: number
  name: string
  sku: string
  unitsLeft: number
  threshold: number
}

export type DashboardRecentTransaction = {
  id: number
  productId: number
  productName: string
  type: string
  productQuantityChanged: number
  unitProductCost: number
  totalProductCost: number
  userId: number
  username: string
  displayName: string
  note: string | null
  createdAtUtc: string
}

export type DashboardOverviewResponse = {
  totalInventoryValue: number
  totalProductsInStock: number
  totalLowStockProductTypes: number
  unitsMovedLast7Days: number
  inventoryMovements: DashboardInventoryMovementPoint[]
  lowStockProducts: DashboardLowStockProduct[]
  recentTransactions: DashboardRecentTransaction[]
}
