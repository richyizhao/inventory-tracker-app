import { Badge } from "@/components/ui/badge"
import { Table } from "@/components/common/table"
import type { TableColumn } from "@/components/common/table"
import { TransactionTableActions } from "@/features/transactions/components/transaction-table-actions"
import type { Transaction } from "@/features/transactions/types/transactions"
import { formatExactDateTime, formatRelativeDateTime } from "@/lib/date-time"

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function getTypeLabel(type: Transaction["type"]) {
  switch (type) {
    case "IN":
      return "Stock in"
    case "OUT":
      return "Stock out"
    case "ADJUSTMENT":
      return "Adjustment"
  }
}

export function TransactionsTableGrid({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const columns: TableColumn<Transaction>[] = [
    {
      key: "productName",
      header: "Product",
      cell: (transaction) => transaction.productName,
    },
    {
      key: "type",
      header: "Type",
      cell: (transaction) => (
        <Badge variant="outline">{getTypeLabel(transaction.type)}</Badge>
      ),
    },
    {
      key: "productQuantityChanged",
      header: "Quantity",
      cell: (transaction) => transaction.productQuantityChanged,
    },
    {
      key: "unitProductCost",
      header: "Unit cost",
      cell: (transaction) => formatCurrency(transaction.unitProductCost),
    },
    {
      key: "totalProductCost",
      header: "Total cost",
      cell: (transaction) => formatCurrency(transaction.totalProductCost),
    },
    {
      key: "displayName",
      header: "User",
      cell: (transaction) => transaction.displayName,
    },
    {
      key: "note",
      header: "Note",
      cellClassName: "max-w-[140px]",
      cell: (transaction) =>
        transaction.note ? (
          <span className="block truncate" title={transaction.note}>
            {transaction.note}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "createdAtUtc",
      header: "Created",
      cell: (transaction) => (
        <span title={formatExactDateTime(transaction.createdAtUtc)}>
          {formatRelativeDateTime(transaction.createdAtUtc)}
        </span>
      ),
    },
    {
      key: "updatedAtUtc",
      header: "Updated",
      cell: (transaction) => (
        <span title={formatExactDateTime(transaction.updatedAtUtc)}>
          {formatRelativeDateTime(transaction.updatedAtUtc)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cellClassName: "w-px",
      cell: (transaction) => (
        <TransactionTableActions transaction={transaction} />
      ),
    },
  ]

  return (
    <Table
      data={transactions}
      columns={columns}
      getRowKey={(transaction) => transaction.id}
      emptyMessage="No transactions found."
    />
  )
}
