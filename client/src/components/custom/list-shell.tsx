import type { ReactNode } from "react"

import { StatePanel } from "@/components/custom/state-panel"

export function ListShell({
  loading,
  error,
  loadingText,
  errorTitle,
  toolbar,
  children,
  footer,
}: {
  loading: boolean
  error?: string | null
  loadingText: string
  errorTitle: string
  toolbar?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}) {
  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <StatePanel kind="loading" message={loadingText} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <StatePanel kind="error" title={errorTitle} message={error} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-6">
      {toolbar}
      {children}
      {footer}
    </div>
  )
}
