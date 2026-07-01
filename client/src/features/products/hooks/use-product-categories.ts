import * as React from "react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { getCategories } from "@/features/categories/api/get-categories"
import type { Category } from "@/features/categories/types/categories"

export function useProductCategories() {
  const { session } = useAuth()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)
  const [categoriesError, setCategoriesError] = React.useState("")

  React.useEffect(() => {
    if (!session?.token) {
      setCategories([])
      setCategoriesError("You need to be signed in to view categories.")
      setIsLoadingCategories(false)
      return
    }

    let isCancelled = false
    setIsLoadingCategories(true)
    setCategoriesError("")

    getCategories(session.token)
      .then((nextCategories) => {
        if (!isCancelled) {
          setCategories(nextCategories)
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setCategories([])
          setCategoriesError(
            error instanceof Error
              ? error.message
              : "Unable to load categories right now."
          )
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingCategories(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [session?.token])

  return {
    categories,
    categoriesError,
    isLoadingCategories,
  }
}
