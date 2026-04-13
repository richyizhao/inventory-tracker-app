import { TrendingDown, TrendingUp } from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnalyticsRange } from "@/features/analytics/api/analytics-api";
import { AnalyticsSummaryCards } from "@/features/analytics/components/analytics-summary-cards";
import { CategoryAreaChartCard } from "@/features/analytics/components/category-area-chart-card";
import { FinancialOverviewChart } from "@/features/analytics/components/financial-overview-chart";
import { InventoryValueDistributionChart } from "@/features/analytics/components/inventory-value-distribution-chart";
import { useAnalyticsOverview } from "@/features/analytics/hooks/use-analytics-overview";
import { formatShortDate } from "@/features/analytics/lib/analytics-format";

const RANGE_OPTIONS: AnalyticsRange[] = [
  "1D",
  "5D",
  "1M",
  "6M",
  "1Y",
  "5Y",
  "Max",
];

export function AnalyticsPage() {
  const { range, error, isLoading, overview, setRange } =
    useAnalyticsOverview();
  const spendingOverTime = overview?.spendingOverTime ?? [];
  const profitOverTime = overview?.profitOverTime ?? [];
  const spendingByCategory = overview?.spendingByCategory ?? [];
  const profitByCategory = overview?.profitByCategory ?? [];
  const inventoryValueDistribution = overview?.inventoryValueDistribution ?? [];

  const spendingCategoryNames = Array.from(
    new Set(
      spendingByCategory.flatMap((point) =>
        Object.keys(point.categories ?? {}),
      ),
    ),
  );
  const profitCategoryNames = Array.from(
    new Set(
      profitByCategory.flatMap((point) => Object.keys(point.categories ?? {})),
    ),
  );

  const spendingAreaData = spendingByCategory.map((point) => ({
    period: formatShortDate(point.period),
    ...(point.categories ?? {}),
  }));
  const profitAreaData = profitByCategory.map((point) => ({
    period: formatShortDate(point.period),
    ...(point.categories ?? {}),
  }));
  const financialOverviewData = spendingOverTime.map((point, index) => ({
    period: formatShortDate(point.period),
    spending: point.amount,
    profit: profitOverTime[index]?.amount ?? 0,
  }));
  const hasAnalyticsData =
    (overview?.totalRestockSpend ?? 0) > 0 ||
    (overview?.totalProfit ?? 0) > 0 ||
    (overview?.totalInventoryValue ?? 0) > 0 ||
    spendingOverTime.length > 0 ||
    profitOverTime.length > 0 ||
    spendingByCategory.length > 0 ||
    profitByCategory.length > 0 ||
    inventoryValueDistribution.length > 0;

  usePageHeaderActions(
    <div className="w-40">
      <Select
        onValueChange={(value) => setRange(value as AnalyticsRange)}
        value={range}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {RANGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>,
    [range, setRange],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="mb-1 text-2xl font-semibold max-md:text-center">
          Metrics
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Track profit & spending trends, and current inventory value.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Analytics unavailable</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!isLoading && overview && !hasAnalyticsData ? (
        <Card>
          <CardHeader>
            <CardTitle>No analytics data yet</CardTitle>
            <CardDescription>
              Analytics only populates when there are inbound restock
              transactions and products with current stock value.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            If you just generated demo data, try a page refresh. If it still
            stays empty, the backend is likely returning no restock history for
            the selected range.
          </CardContent>
        </Card>
      ) : null}

      <AnalyticsSummaryCards
        overview={overview}
        trackedCategories={inventoryValueDistribution.length}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <FinancialOverviewChart
          data={financialOverviewData}
          isLoading={isLoading}
          showChart={Boolean(overview)}
        />
        <InventoryValueDistributionChart
          data={inventoryValueDistribution}
          isLoading={isLoading}
          showChart={Boolean(overview)}
        />
      </div>

      <CategoryAreaChartCard
        categoryNames={profitCategoryNames}
        data={profitAreaData}
        description="Category-level gross profit over time based on outbound movements."
        emptyMessage="Profit appears after outbound movements are recorded for products with a selling price."
        icon={<TrendingUp className="size-4" />}
        isLoading={isLoading || !overview}
        signMode="positive"
        stackId="profit"
        title="Profit by category"
      />

      <CategoryAreaChartCard
        categoryNames={spendingCategoryNames}
        data={spendingAreaData}
        description="Category-level restock spending over time."
        emptyMessage="Record at least one restock with cost data to populate category spending."
        icon={<TrendingDown className="size-4" />}
        isLoading={isLoading || !overview}
        signMode="negative"
        stackId="spending"
        title="Spending by category"
      />
    </div>
  );
}
