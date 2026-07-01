import { getRoles } from "@/features/roles/api/get-roles"
import { useRefreshableProtectedLoad } from "@/hooks/use-refreshable-protected-load"
import { ROLES_REFRESH_EVENT } from "@/lib/refresh-events"

export function useRolesTable() {
  const loadState = useRefreshableProtectedLoad({
    errorMessage: "Unable to load roles right now.",
    eventName: ROLES_REFRESH_EVENT,
    load: getRoles,
    unauthenticatedMessage: "You need to be signed in to view roles.",
  })

  return {
    loadState:
      loadState.status === "success"
        ? {
            status: "success" as const,
            roles: loadState.data,
          }
        : loadState,
  }
}
