import { getDashboardOverview } from "@/features/dashboard/api/get-dashboard-overview"
import { DASHBOARD_REFRESH_EVENT } from "@/lib/refresh-events"
import { useRefreshableProtectedLoad } from "@/hooks/use-refreshable-protected-load"

export function useDashboardOverview() {
  const loadState = useRefreshableProtectedLoad({
    eventName: DASHBOARD_REFRESH_EVENT,
    errorMessage: "Failed to load dashboard.",
    unauthenticatedMessage: "You need to be signed in to view dashboard.",
    load: getDashboardOverview,
  })

  return {
    loadState,
  }
}
