import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
import type {
  ProfitByCategoryPoint,
  RestockExpenseByCategoryPoint,
} from "@/features/analytics/types/analytics"

export const description = "A bar chart with a custom label"

const chartConfig = {
  spending: {
    label: "Spending",
    color: "var(--chart-1)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatCompactLabelValue(
  value: number | string | boolean | null | undefined
) {
  return formatCompactNumber(Number(value ?? 0))
}

type ChartDatum = {
  categoryName: string
  profit: number
  spending: number
}

export function ChartBarHorizontal({
  profitData = [],
  spendingData = [],
  title = "Spending vs Profit by Category",
  descriptionText = "Spending and profit by category for the selected range",
}: {
  profitData?: ProfitByCategoryPoint[]
  spendingData?: RestockExpenseByCategoryPoint[]
  title?: string
  descriptionText?: string
}) {
  const chartData: ChartDatum[] = Array.from(
    new Set([
      ...profitData.map((item) => item.categoryName),
      ...spendingData.map((item) => item.categoryName),
    ])
  )
    .map((categoryName) => ({
      categoryName,
      profit:
        profitData.find((item) => item.categoryName === categoryName)?.profit ??
        0,
      spending:
        spendingData.find((item) => item.categoryName === categoryName)
          ?.restockExpense ?? 0,
    }))
    .sort(
      (left, right) =>
        Math.max(right.profit, right.spending) -
        Math.max(left.profit, left.spending)
    )

  const domainMax = Math.max(
    ...chartData.flatMap((item) => [item.profit, item.spending]),
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{descriptionText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 48,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="categoryName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={90}
            />
            <XAxis
              type="number"
              domain={[0, domainMax]}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
              hide
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="spending"
              fill="var(--color-spending)"
              radius={4}
              barSize={24}
            >
              <LabelList
                dataKey="spending"
                position="right"
                offset={8}
                formatter={formatCompactLabelValue}
                className="fill-muted-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="profit"
              fill="var(--color-profit)"
              radius={4}
              barSize={24}
            >
              <LabelList
                dataKey="profit"
                position="right"
                offset={8}
                formatter={formatCompactLabelValue}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
