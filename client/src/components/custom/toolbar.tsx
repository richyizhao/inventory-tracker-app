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
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full lg:max-w-sm">{search}</div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {filters}
        {actions}
      </div>
    </div>
  )
}
