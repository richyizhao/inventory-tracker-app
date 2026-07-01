import * as React from "react"

import { SEEDED_ADMIN_USERNAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createDemoData } from "@/features/settings/api/create-demo-data"
import { deleteDemoData } from "@/features/settings/api/delete-demo-data"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function useDemoDataActions() {
  const { isAuthenticated, session } = useAuth()
  const [isCreatingDemoData, setIsCreatingDemoData] = React.useState(false)
  const [isDeletingDemoData, setIsDeletingDemoData] = React.useState(false)

  const isAdminUser =
    isAuthenticated && session?.username.toLowerCase() === SEEDED_ADMIN_USERNAME

  async function handleCreateDemoData() {
    if (!session?.token) {
      toast.error("You need to be signed in to create demo data.")
      return
    }

    setIsCreatingDemoData(true)

    try {
      const response = await createDemoData(session.token)
      toast.success(response.message)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to create demo data right now."

      toast.error(message)
    } finally {
      setIsCreatingDemoData(false)
    }
  }

  async function handleDeleteDemoData() {
    if (!session?.token) {
      toast.error("You need to be signed in to remove demo data.")
      return
    }

    setIsDeletingDemoData(true)

    try {
      const response = await deleteDemoData(session.token)
      toast.success(response.message)
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to remove demo data right now."

      toast.error(message)
    } finally {
      setIsDeletingDemoData(false)
    }
  }

  return {
    isAdminUser,
    isAuthenticated,
    isCreatingDemoData,
    isDeletingDemoData,
    handleCreateDemoData,
    handleDeleteDemoData,
  }
}
