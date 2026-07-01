import type { ReactNode } from "react"

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type TableColumn<TItem> = {
  key: string
  header: ReactNode
  headerClassName?: string
  cellClassName?: string
  cell: (item: TItem) => ReactNode
}

export function Table<TItem>({
  data,
  columns,
  getRowKey,
  emptyMessage,
}: {
  data: TItem[]
  columns: TableColumn<TItem>[]
  getRowKey: (item: TItem) => string | number
  emptyMessage: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <UITable>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.cellClassName}>
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UITable>
    </div>
  )
}
