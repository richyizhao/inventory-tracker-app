import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardOverviewResponse } from "@/features/dashboard/types/dashboard"
import { formatCompactNumber, formatCurrency } from "@/lib/number-format"

export function SectionCards({
  summary,
}: {
  summary: Pick<
    DashboardOverviewResponse,
    "totalInventoryValue" | "totalLowStockProductTypes" | "totalProductsInStock" | "unitsMovedLast7Days"
  >
}) {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Inventory Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(summary.totalInventoryValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Live inventory cost</div>
          <div className="text-muted-foreground">Based on stock and buy price</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Units Moved (7d)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCompactNumber(summary.unitsMovedLast7Days)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">7 days</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Inbound + outbound volume</div>
          <div className="text-muted-foreground">Movement over the last week</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Products In Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCompactNumber(summary.totalProductsInStock)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Now</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Sellable products now</div>
          <div className="text-muted-foreground">Currently available in stock</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCompactNumber(summary.totalLowStockProductTypes)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Watch</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">Below threshold</div>
          <div className="text-muted-foreground">Review urgent items below</div>
        </CardFooter>
      </Card>
    </div>
  )
}
