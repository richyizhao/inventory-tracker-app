import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useRefreshTrigger } from "@/hooks/use-refresh-trigger"
import type { PagedLoadState } from "@/types/load-state"
import type { PagedResponse } from "@/types/pagination"

export function useRefreshableProtectedPagedLoad<TItem, TKey extends string>({
  errorMessage,
  eventName,
  itemKey,
  load,
  resetPageDeps,
  setPage,
  unauthenticatedMessage,
}: {
  errorMessage: string
  eventName: string
  itemKey: TKey
  load: (token: string) => Promise<PagedResponse<TItem>>
  resetPageDeps: React.DependencyList
  setPage: React.Dispatch<React.SetStateAction<number>>
  unauthenticatedMessage: string
}) {
  const { session } = useAuth()
  const [loadState, setLoadState] = React.useState<PagedLoadState<TItem, TKey>>(
    {
      status: "loading",
    }
  )

  React.useEffect(() => {
    setPage(1)
  }, [setPage, ...resetPageDeps])

  const handleRefresh = React.useCallback(() => {
    setPage(1)
  }, [setPage])

  const refreshKey = useRefreshTrigger(eventName, handleRefresh)

  React.useEffect(() => {
    if (!session?.token) {
      setLoadState({
        status: "error",
        message: unauthenticatedMessage,
      })
      return
    }

    let isCancelled = false

    setLoadState((currentState) =>
      currentState.status === "success" ? currentState : { status: "loading" }
    )

    load(session.token)
      .then((response) => {
        if (isCancelled) {
          return
        }

        setLoadState({
          status: "success",
          [itemKey]: response.items,
          totalItems: response.totalItems,
          page: response.page,
          pageSize: response.pageSize,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
        })
      })
      .catch((loadError: unknown) => {
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
              loadError instanceof Error ? loadError.message : errorMessage,
          }
        })
      })

    return () => {
      isCancelled = true
    }
  }, [
    errorMessage,
    itemKey,
    load,
    refreshKey,
    session?.token,
    unauthenticatedMessage,
  ])

  return {
    loadState,
  }
}
