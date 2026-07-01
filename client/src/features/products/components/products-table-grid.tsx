import { Badge } from "@/components/ui/badge"
import { Grid } from "@/components/custom/grid"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductTableActions } from "@/features/products/components/product-table-actions"
import type { Product } from "@/features/products/types/products"
import placeholderImage from "@/assets/placeholder.png"

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatPercentage(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

export function ProductsTableGrid({ products }: { products: Product[] }) {
  return (
    <Grid
      data={products}
      getKey={(product) => product.id}
      emptyMessage="No products found."
      emptyClassName="h-[136px] min-h-[136px] text-sm"
      className="grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
      renderItem={(product) => {
        const imageSrc = product.imageUrl || placeholderImage
        const margin = product.sellPrice - product.buyPrice
        const marginPercentage = product.sellPrice > 0 ? margin / product.sellPrice : 0

        return (
          <Card className="h-full gap-0 py-0">
            <img
              src={imageSrc}
              alt={product.name}
              className="aspect-[4/3] w-full bg-muted object-cover"
            />
            <CardHeader className="gap-2 pt-4">
              <CardTitle className="line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="mt-1 space-y-3 pb-4">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-muted-foreground">SKU:</span>{" "}
                  {product.sku}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">Sell Price:</span>{" "}
                  {formatCurrency(product.sellPrice)}
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">Margin:</span>{" "}
                  {formatCurrency(margin)}{" "}
                  <Badge
                    variant="secondary"
                    className={
                      marginPercentage < 0
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-700"
                    }
                  >
                    {formatPercentage(marginPercentage)}
                  </Badge>
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">Total Units:</span>{" "}
                  {product.totalUnitStock}{" "}
                  {product.isLowStock ? <Badge variant="destructive">Low stock</Badge> : null}
                </p>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <ProductTableActions product={product} />
            </CardFooter>
          </Card>
        )
      }}
    />
  )
}
