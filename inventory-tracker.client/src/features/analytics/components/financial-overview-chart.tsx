import { TrendingUpDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartSurface } from "@/features/analytics/components/chart-surface";
import { formatTooltipCurrency } from "@/features/analytics/lib/analytics-format";

type FinancialOverviewPoint = {
  period: string;
  spending: number;
  profit: number;
};

type FinancialOverviewChartProps = {
  data: FinancialOverviewPoint[];
  isLoading: boolean;
  showChart: boolean;
};

export function FinancialOverviewChart({
  data,
  isLoading,
  showChart,
}: FinancialOverviewChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpDown className="size-4" />
          Total profit & spending over time
        </CardTitle>
        <CardDescription>
          Compare gross profit against restock spend across the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 min-w-0">
        {isLoading || !showChart ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : (
          <ChartSurface
            heightClass="h-full"
            renderChart={({ width, height }) => (
              <BarChart data={data} height={height} width={width}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  axisLine={false}
                  dataKey="period"
                  minTickGap={24}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) =>
                    formatTooltipCurrency(
                      value as number | string | undefined,
                      name === "spending" ? "negative" : "positive",
                    )
                  }
                />
                <Legend
                  formatter={(value) =>
                    value === "spending" ? "- Spend" : "+ Profit"
                  }
                />
                <Bar dataKey="spending" fill="#0f766e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
