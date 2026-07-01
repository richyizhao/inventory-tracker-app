import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, type TableColumn } from "@/components/custom/table"
import type { DashboardRecentTransaction } from "@/features/dashboard/types/dashboard"
import { formatRelativeDateTime } from "@/lib/date-time"

const transactionColumns: TableColumn<DashboardRecentTransaction>[] = [
  {
    key: "productName",
    header: "Product",
    cell: (item) => <div className="font-medium">{item.productName}</div>,
  },
  {
    key: "type",
    header: "Type",
    cell: (item) => (
      <Badge variant="outline" className="w-fit">
        {item.type}
      </Badge>
    ),
  },
  {
    key: "quantity",
    header: "Qty",
    cell: (item) => item.productQuantityChanged,
  },
  {
    key: "displayName",
    header: "User",
    cell: (item) => item.displayName,
  },
  {
    key: "createdAtUtc",
    header: "When",
    headerClassName: "text-right",
    cellClassName: "text-right text-muted-foreground",
    cell: (item) => formatRelativeDateTime(item.createdAtUtc),
  },
]

export function RecentTransactionsCard({
  transactions,
}: {
  transactions: DashboardRecentTransaction[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest inventory activity across the store</CardDescription>
      </CardHeader>
      <CardContent>
        <Table
          data={transactions}
          columns={transactionColumns}
          getRowKey={(item) => item.id}
          emptyMessage="No recent transactions."
        />
      </CardContent>
    </Card>
  )
}
