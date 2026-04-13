import { request } from "@/lib/http";

export type SpendingPoint = {
  period: string;
  amount: number;
};

export type CategorySpendPoint = {
  period: string;
  total: number;
  categories: Record<string, number>;
};

export type InventoryValueSlice = {
  categoryName: string;
  inventoryValue: number;
  unitsInStock: number;
  productCount: number;
};

export type AnalyticsOverview = {
  totalInventoryValue: number;
  totalRestockSpend: number;
  totalProfit: number;
  spendingOverTime: SpendingPoint[];
  profitOverTime: SpendingPoint[];
  spendingByCategory: CategorySpendPoint[];
  profitByCategory: CategorySpendPoint[];
  inventoryValueDistribution: InventoryValueSlice[];
};

export type AnalyticsRange = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "Max";

function getRangeQuery(range: AnalyticsRange) {
  switch (range) {
    case "1D":
      return "days=1";
    case "5D":
      return "days=5";
    case "1M":
      return "days=30";
    case "6M":
      return "days=180";
    case "1Y":
      return "days=365";
    case "5Y":
      return "days=1825";
    case "Max":
      return "max=true";
  }
}

export async function getAnalyticsOverview(token: string, range: AnalyticsRange) {
  const response = await request<Partial<AnalyticsOverview>>(
    `/Analytics/overview?${getRangeQuery(range)}`,
    { token },
  );

  return {
    totalInventoryValue: response.totalInventoryValue ?? 0,
    totalRestockSpend: response.totalRestockSpend ?? 0,
    totalProfit: response.totalProfit ?? 0,
    spendingOverTime: response.spendingOverTime ?? [],
    profitOverTime: response.profitOverTime ?? [],
    spendingByCategory: response.spendingByCategory ?? [],
    profitByCategory: response.profitByCategory ?? [],
    inventoryValueDistribution: response.inventoryValueDistribution ?? [],
  } satisfies AnalyticsOverview;
}
