import type { AnalyticsRangeLabel } from "@/features/analytics/lib/analytics-ranges"

export const ANALYTICS_RANGE_CHANGE_EVENT = "analytics-range-change"

export function dispatchAnalyticsRangeChange(range: AnalyticsRangeLabel) {
  window.dispatchEvent(
    new CustomEvent<AnalyticsRangeLabel>(ANALYTICS_RANGE_CHANGE_EVENT, {
      detail: range,
    })
  )
}
