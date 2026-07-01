import * as React from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { SEEDED_ADMIN_ROLE_NAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteRole } from "@/features/roles/api/delete-role"
import { dispatchRolesRefresh } from "@/lib/refresh-events"
import type { RoleRow } from "@/features/roles/types/roles"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteRoleDialog({
  onOpenChange,
  role,
}: {
  onOpenChange?: (open: boolean) => void
  role: RoleRow
}) {
  const { session } = useAuth()
  const isAdminRole = role.name === SEEDED_ADMIN_ROLE_NAME
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      toast.error("You need to be signed in to delete a role.")
      return
    }

    if (isAdminRole) {
      toast.error("The admin role cannot be deleted.")
      return
    }

    setIsSubmitting(true)

    try {
      await deleteRole(role.id, session.token)
      dispatchRolesRefresh()
      toast.success(`Deleted role ${role.name}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete role right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={<>Are you sure you want to delete {role.name}?</>}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isAdminRole}
      submitLabel="Delete role"
      submittingLabel="Deleting..."
      title="Delete role"
    />
  )
}
