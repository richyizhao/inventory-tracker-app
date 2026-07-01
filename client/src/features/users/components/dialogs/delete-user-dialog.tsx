import * as React from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { SEEDED_ADMIN_USERNAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteUser } from "@/features/users/api/delete-user"
import { dispatchUsersRefresh } from "@/lib/refresh-events"
import type { User } from "@/features/users/types/users"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteUserDialog({
  onOpenChange,
  user,
}: {
  onOpenChange?: (open: boolean) => void
  user: User
}) {
  const { session } = useAuth()
  const isAdminUser = user.username.toLowerCase() === SEEDED_ADMIN_USERNAME
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      const message = "You need to be signed in to delete a user."
      toast.error(message)
      return
    }

    if (isAdminUser) {
      toast.error("The seeded admin account cannot be deleted.")
      return
    }

    setIsSubmitting(true)

    try {
      await deleteUser(user.id, session.token)
      dispatchUsersRefresh()
      toast.success(`Deleted user ${user.username}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete user right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={<>Are you sure you want to delete {user.username}?</>}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isAdminUser}
      submitLabel="Delete user"
      submittingLabel="Deleting..."
      title="Delete user"
    />
  )
}
