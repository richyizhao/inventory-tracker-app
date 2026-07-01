import { getCategories } from "@/features/categories/api/get-categories"
import { useRefreshableProtectedLoad } from "@/hooks/use-refreshable-protected-load"
import { CATEGORIES_REFRESH_EVENT } from "@/lib/refresh-events"

export function useCategoriesTable() {
  const loadState = useRefreshableProtectedLoad({
    errorMessage: "Unable to load categories right now.",
    eventName: CATEGORIES_REFRESH_EVENT,
    load: getCategories,
    unauthenticatedMessage: "You need to be signed in to view categories.",
  })

  return {
    loadState:
      loadState.status === "success"
        ? {
            status: "success" as const,
            categories: loadState.data,
          }
        : loadState,
  }
}
