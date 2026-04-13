import { Boxes, PieChartIcon, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnalyticsOverview } from "@/features/analytics/api/analytics-api";
import { formatCurrency } from "@/features/analytics/lib/analytics-format";

type AnalyticsSummaryCardsProps = {
  overview: AnalyticsOverview | null;
  trackedCategories: number;
};

export function AnalyticsSummaryCards({
  overview,
  trackedCategories,
}: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={<TrendingDown className="size-8 text-muted-foreground" />}
        title="Total restock spend"
        value={overview ? formatCurrency(overview.totalRestockSpend) : "-"}
      />
      <SummaryCard
        icon={<TrendingUp className="size-8 text-muted-foreground" />}
        title="Total profit"
        value={overview ? formatCurrency(overview.totalProfit) : "-"}
      />
      <SummaryCard
        icon={<Boxes className="size-8 text-muted-foreground" />}
        title="Total inventory value"
        value={overview ? formatCurrency(overview.totalInventoryValue) : "-"}
      />
      <SummaryCard
        icon={<PieChartIcon className="size-8 text-muted-foreground" />}
        title="Tracked categories"
        value={overview ? String(trackedCategories) : "-"}
      />
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
        </div>
        <div className="mr-1 rounded-2xl border bg-muted/50 p-2">{icon}</div>
      </CardHeader>
    </Card>
  );
}
