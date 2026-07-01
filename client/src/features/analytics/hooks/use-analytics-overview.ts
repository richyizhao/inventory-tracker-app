import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { getInventoryValueDistribution } from "@/features/analytics/api/get-inventory-value-distribution"
import { getProfitByCategory } from "@/features/analytics/api/get-profit-by-category"
import { getProfitSpendingOverTime } from "@/features/analytics/api/get-profit-spending-over-time"
import { getRestockExpenseByCategory } from "@/features/analytics/api/get-restock-expense-by-category"
import { ANALYTICS_RANGE_CHANGE_EVENT } from "@/features/analytics/lib/analytics-events"
import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"
import type { AnalyticsOverviewLoadState } from "@/features/analytics/types/analytics"

const DEFAULT_ANALYTICS_RANGE: AnalyticsRangeLabel = "1 month"

export function useAnalyticsOverview() {
  const { isAuthenticated, session } = useAuth()
  const [range, setRange] = React.useState<AnalyticsRangeLabel>(DEFAULT_ANALYTICS_RANGE)
  const [loadState, setLoadState] = React.useState<AnalyticsOverviewLoadState>({
    status: "loading",
  })

  React.useEffect(() => {
    function handleRangeChange(event: Event) {
      const nextRange = (event as CustomEvent<AnalyticsRangeLabel>).detail

      if (nextRange) {
        setRange(nextRange)
      }
    }

    window.addEventListener(ANALYTICS_RANGE_CHANGE_EVENT, handleRangeChange)

    return () => {
      window.removeEventListener(ANALYTICS_RANGE_CHANGE_EVENT, handleRangeChange)
    }
  }, [])

  React.useEffect(() => {
    if (!isAuthenticated || !session?.token) {
      setLoadState({
        status: "error",
        message: "You need to be signed in to view analytics.",
      })
      return
    }

    let isCancelled = false
    setLoadState((currentState) =>
      currentState.status === "success" ? currentState : { status: "loading" }
    )

    Promise.all([
      getProfitSpendingOverTime(range, session.token),
      getInventoryValueDistribution(session.token),
      getProfitByCategory(range, session.token),
      getRestockExpenseByCategory(range, session.token),
    ])
      .then(
        ([
          profitSpendingOverTime,
          inventoryValueDistribution,
          profitByCategory,
          restockExpenseByCategory,
        ]) => {
          if (isCancelled) {
            return
          }

          setLoadState({
            status: "success",
            data: {
              profitSpendingOverTime,
              inventoryValueDistribution,
              profitByCategory,
              restockExpenseByCategory,
            },
          })
        }
      )
      .catch((error: unknown) => {
        if (isCancelled) {
          return
        }

        setLoadState((currentState) => {
          if (currentState.status === "success") {
            return currentState
          }

          return {
            status: "error",
            message:
              error instanceof Error ? error.message : "Failed to load analytics.",
          }
        })
      })

    return () => {
      isCancelled = true
    }
  }, [isAuthenticated, range, session?.token])

  return { loadState, range }
}
