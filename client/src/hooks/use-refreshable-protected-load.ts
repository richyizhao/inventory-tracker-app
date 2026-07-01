import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useRefreshTrigger } from "@/hooks/use-refresh-trigger"
import type { LoadState } from "@/types/load-state"

export function useRefreshableProtectedLoad<TData>({
  errorMessage,
  eventName,
  load,
  unauthenticatedMessage,
}: {
  errorMessage: string
  eventName: string
  load: (token: string) => Promise<TData>
  unauthenticatedMessage: string
}) {
  const { session } = useAuth()
  const [loadState, setLoadState] = React.useState<LoadState<TData>>({
    status: "loading",
  })
  const refreshKey = useRefreshTrigger(eventName)

  React.useEffect(() => {
    if (!session?.token) {
      setLoadState({
        status: "error",
        message: unauthenticatedMessage,
      })
      return
    }

    let isCancelled = false
    setLoadState({ status: "loading" })

    load(session.token)
      .then((data) => {
        if (!isCancelled) {
          setLoadState({
            status: "success",
            data,
          })
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setLoadState({
            status: "error",
            message:
              loadError instanceof Error ? loadError.message : errorMessage,
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [errorMessage, load, refreshKey, session?.token, unauthenticatedMessage])

  return loadState
}
