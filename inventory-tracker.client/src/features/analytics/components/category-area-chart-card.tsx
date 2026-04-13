import type { ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartSurface } from "@/features/analytics/components/chart-surface";
import {
  formatTooltipCurrency,
  PIE_COLORS,
} from "@/features/analytics/lib/analytics-format";

type CategoryAreaChartCardProps = {
  categoryNames: string[];
  data: Array<Record<string, string | number>>;
  emptyMessage: string;
  icon: ReactNode;
  isLoading: boolean;
  signMode: "positive" | "negative";
  stackId: string;
  title: string;
  description: string;
};

export function CategoryAreaChartCard({
  categoryNames,
  data,
  description,
  emptyMessage,
  icon,
  isLoading,
  signMode,
  stackId,
  title,
}: CategoryAreaChartCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-96 min-w-0">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : categoryNames.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <ChartSurface
            heightClass="h-full"
            renderChart={({ width, height }) => (
              <AreaChart data={data} height={height} width={width}>
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
                  formatter={(value) =>
                    formatTooltipCurrency(
                      value as number | string | undefined,
                      signMode,
                    )
                  }
                />
                {categoryNames.map((categoryName, index) => (
                  <Area
                    key={categoryName}
                    dataKey={categoryName}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    fillOpacity={0.3}
                    stackId={stackId}
                    stroke={PIE_COLORS[index % PIE_COLORS.length]}
                    type="monotone"
                  />
                ))}
              </AreaChart>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
