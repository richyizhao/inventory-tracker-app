import type { ReactNode } from "react"

export function Toolbar({
  search,
  filters,
  actions,
}: {
  search?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="w-full 2xl:max-w-sm">{search}</div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {filters}
        {actions}
      </div>
    </div>
  )
}
