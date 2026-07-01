import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatePanel } from "@/components/custom/state-panel"
import type { DashboardLowStockProduct } from "@/features/dashboard/types/dashboard"

export function LowStockProductsPanel({
  products,
}: {
  products: DashboardLowStockProduct[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
        <CardDescription>Products closest to or below threshold</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[360px] overflow-y-auto pr-2">
        {products.length === 0 ? (
          <StatePanel
            kind="empty"
            message="No low stock products right now."
            className="mb-0 min-h-[200px]"
          />
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{product.unitsLeft} left</div>
                  <div className="text-sm text-muted-foreground">Threshold {product.threshold}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
