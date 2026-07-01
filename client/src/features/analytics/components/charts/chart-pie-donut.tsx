import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import type { InventoryValueDistributionPoint } from "@/features/analytics/types/analytics"

export const description = "A donut chart"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const PIE_LABEL_OFFSET = 30

function renderPieLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
}: {
  cx?: number
  cy?: number
  midAngle?: number
  outerRadius?: number
  name?: string | number
}) {
  const safeCx = Number(cx ?? 0)
  const safeCy = Number(cy ?? 0)
  const safeMidAngle = Number(midAngle ?? 0)
  const safeOuterRadius = Number(outerRadius ?? 0)
  const radius = safeOuterRadius + PIE_LABEL_OFFSET
  const x = safeCx + radius * Math.cos((-safeMidAngle * Math.PI) / 180)
  const y = safeCy + radius * Math.sin((-safeMidAngle * Math.PI) / 180)

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > safeCx ? "start" : "end"}
      dominantBaseline="central"
    >
      {String(name ?? "")}
    </text>
  )
}

export function ChartPieDonut({
  data = [],
}: {
  data?: InventoryValueDistributionPoint[]
}) {
  const chartData = data.map((item, index) => ({
    categoryName: item.categoryName,
    inventoryValue: item.inventoryValue,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }))

  const chartConfig = chartData.reduce<ChartConfig>(
    (config, item) => {
      config[item.categoryName] = {
        label: item.categoryName,
        color: item.fill,
      }
      return config
    },
    {
      inventoryValue: {
        label: "Inventory Value",
      },
    }
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Value Distribution</CardTitle>
        <CardDescription>Share of inventory value by category</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto my-auto h-[360px] w-full max-w-[380px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="inventoryValue"
              nameKey="categoryName"
              innerRadius={60}
              outerRadius={90}
              cy="50%"
              label={renderPieLabel}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
