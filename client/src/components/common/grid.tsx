import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { StatePanel } from "@/components/common/state-panel"

export function Grid<TItem>({
  data,
  getKey,
  renderItem,
  className,
  emptyMessage,
  emptyClassName,
}: {
  data: TItem[]
  getKey: (item: TItem) => string | number
  renderItem: (item: TItem) => ReactNode
  className?: string
  emptyMessage: string
  emptyClassName?: string
}) {
  if (data.length === 0) {
    return (
      <StatePanel
        kind="empty"
        message={emptyMessage}
        className={emptyClassName}
      />
    )
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {data.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  )
}
