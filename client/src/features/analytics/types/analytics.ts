export type ProfitSpendingPoint = {
  date: string
  profit: number
  spending: number
}

export type InventoryValueDistributionPoint = {
  categoryId: number
  categoryName: string
  inventoryValue: number
}

export type ProfitByCategoryPoint = {
  categoryId: number
  categoryName: string
  profit: number
}

export type RestockExpenseByCategoryPoint = {
  categoryId: number
  categoryName: string
  restockExpense: number
}

export type AnalyticsOverviewData = {
  profitSpendingOverTime: ProfitSpendingPoint[]
  inventoryValueDistribution: InventoryValueDistributionPoint[]
  profitByCategory: ProfitByCategoryPoint[]
  restockExpenseByCategory: RestockExpenseByCategoryPoint[]
}

export type AnalyticsOverviewLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: AnalyticsOverviewData }
