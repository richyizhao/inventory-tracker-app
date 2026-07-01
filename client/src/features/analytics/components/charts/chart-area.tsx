import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  type ChartConfig,
} from "@/components/ui/chart"
import type { ProfitSpendingPoint } from "@/features/analytics/types/analytics"

export const description = "An area chart with a legend"

const chartConfig = {
  spending: {
    label: "Spending",
    color: "var(--chart-2)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function ChartArea({
  data = [],
  descriptionText = "Showing spending and profit for the selected range",
}: {
  data?: ProfitSpendingPoint[]
  descriptionText?: string
}) {
  const chartData = data.map((item) => ({
    date: item.date,
    profit: item.profit,
    spending: item.spending,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending vs Profit Over Time</CardTitle>
        <CardDescription>{descriptionText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Area
              dataKey="profit"
              type="monotone"
              fill="var(--color-profit)"
              fillOpacity={0.4}
              stroke="var(--color-profit)"
            />
            <Area
              dataKey="spending"
              type="monotone"
              fill="var(--color-spending)"
              fillOpacity={0.4}
              stroke="var(--color-spending)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
