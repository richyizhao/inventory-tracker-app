import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usersTablePageSizeOptions } from "@/config/app-config"

export function Pagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  visibleItemsCount,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  itemLabel,
  rowsPerPageId,
}: {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  visibleItemsCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  onPageChange: (value: number | ((currentValue: number) => number)) => void
  onPageSizeChange: (value: number) => void
  itemLabel: string
  rowsPerPageId: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {visibleItemsCount} of {totalItems} {itemLabel}
      </div>
      <div className="flex w-full items-center justify-end gap-8 lg:w-fit">
        <div className="flex items-center gap-2">
          <Label htmlFor={rowsPerPageId} className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageChange(1)
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger size="sm" className="w-20" id={rowsPerPageId}>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {usersTablePageSizeOptions.map((nextPageSize) => (
                  <SelectItem key={nextPageSize} value={`${nextPageSize}`}>
                    {nextPageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange((currentPage) => Math.max(1, currentPage - 1))}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange((currentPage) => currentPage + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
