import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { getProducts } from "@/features/products/api/get-products"
import type { Product } from "@/features/products/types/products"
import { getUsers } from "@/features/users/api/get-users"
import type { User } from "@/features/users/types/users"

function compareByName(left: { name?: string; displayName?: string }, right: { name?: string; displayName?: string }) {
  const leftLabel = left.name ?? left.displayName ?? ""
  const rightLabel = right.name ?? right.displayName ?? ""

  return leftLabel.localeCompare(rightLabel, undefined, {
    sensitivity: "base",
  })
}

export function useTransactionOptions() {
  const { session } = useAuth()
  const [products, setProducts] = React.useState<Product[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(true)
  const [optionsError, setOptionsError] = React.useState("")

  React.useEffect(() => {
    if (!session?.token) {
      setProducts([])
      setUsers([])
      setOptionsError("You need to be signed in to manage transactions.")
      setIsLoadingOptions(false)
      return
    }

    let isCancelled = false
    setIsLoadingOptions(true)
    setOptionsError("")

    Promise.all([
      getProducts({
        page: 1,
        pageSize: 100,
        sort: "name-a-z",
        token: session.token,
      }),
      getUsers({
        page: 1,
        pageSize: 100,
        token: session.token,
      }),
    ])
      .then(([productsResponse, usersResponse]) => {
        if (isCancelled) {
          return
        }

        setProducts([...productsResponse.items].sort(compareByName))
        setUsers(
          [...usersResponse.items].sort((left, right) =>
            left.displayName.localeCompare(right.displayName, undefined, {
              sensitivity: "base",
            })
          )
        )
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setProducts([])
          setUsers([])
          setOptionsError(
            error instanceof Error
              ? error.message
              : "Unable to load transaction options right now."
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingOptions(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [session?.token])

  return {
    isLoadingOptions,
    optionsError,
    products,
    users,
  }
}
