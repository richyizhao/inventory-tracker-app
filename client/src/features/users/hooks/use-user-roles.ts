import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { getRoleOptions } from "@/features/roles/api/get-role-options"
import type { UserRoleOption } from "@/features/roles/types/roles"

const EMPTY_FALLBACK_ROLES: UserRoleOption[] = []

export function useUserRoles({
  fallbackRoles = EMPTY_FALLBACK_ROLES,
}: {
  fallbackRoles?: UserRoleOption[]
} = {}) {
  const { session } = useAuth()
  const [roles, setRoles] = React.useState<UserRoleOption[]>(fallbackRoles)
  const [isLoadingRoles, setIsLoadingRoles] = React.useState(true)
  const [rolesError, setRolesError] = React.useState("")

  React.useEffect(() => {
    if (!session?.token) {
      setRoles(fallbackRoles)
      setIsLoadingRoles(false)
      return
    }

    let isCancelled = false
    setIsLoadingRoles(true)
    setRolesError("")

    getRoleOptions(session.token)
      .then((nextRoles) => {
        if (!isCancelled) {
          setRoles(() => {
            const nextByName = new Map(
              [...fallbackRoles, ...nextRoles].map((role) => [role.name, role])
            )

            return [...nextByName.values()]
          })
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setRolesError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load roles right now."
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingRoles(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [fallbackRoles, session?.token])

  return {
    roles,
    isLoadingRoles,
    rolesError,
  }
}
