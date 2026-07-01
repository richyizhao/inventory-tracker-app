import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import type { DashboardInventoryMovementPoint } from "@/features/dashboard/types/dashboard"
import { formatCompactNumber } from "@/lib/number-format"

const chartConfig = {
  stockIn: {
    label: "Stock In",
    color: "var(--chart-2)",
  },
  stockOut: {
    label: "Stock Out",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarVertical({
  data,
}: {
  data: DashboardInventoryMovementPoint[]
}) {
  const chartData = data.map((item) => ({
    ...item,
    day: new Date(item.date).toLocaleDateString(undefined, {
      weekday: "short",
    }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Movements</CardTitle>
        <CardDescription>
          Stock in vs stock out over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 4,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="stockIn"
              fill="var(--color-stockIn)"
              radius={4}
              barSize={18}
            />
            <Bar
              dataKey="stockOut"
              fill="var(--color-stockOut)"
              radius={4}
              barSize={18}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
