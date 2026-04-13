import { Boxes } from "lucide-react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { InventoryValueSlice } from "@/features/analytics/api/analytics-api";
import { ChartSurface } from "@/features/analytics/components/chart-surface";
import {
  formatTooltipCurrency,
  PIE_COLORS,
} from "@/features/analytics/lib/analytics-format";

type InventoryValueDistributionChartProps = {
  data: InventoryValueSlice[];
  isLoading: boolean;
  showChart: boolean;
};

export function InventoryValueDistributionChart({
  data,
  isLoading,
  showChart,
}: InventoryValueDistributionChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes className="size-4" />
          Inventory value distribution
        </CardTitle>
        <CardDescription>
          Current inventory value split by category.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 min-w-0">
        {isLoading || !showChart ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : (
          <ChartSurface
            heightClass="h-full"
            renderChart={({ width, height }) => (
              <PieChart height={height} width={width}>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={data}
                  dataKey="inventoryValue"
                  innerRadius={70}
                  nameKey="categoryName"
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.categoryName}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatTooltipCurrency(value as number | string | undefined)
                  }
                />
              </PieChart>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
