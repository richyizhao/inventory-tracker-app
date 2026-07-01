import * as React from "react"

import { FormDialog } from "@/components/common/form-dialog"
import { SEEDED_ADMIN_ROLE_NAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { updateRole } from "@/features/roles/api/update-role"
import { RoleFormFields } from "@/features/roles/components/forms/role-form-fields"
import { useRoleForm } from "@/features/roles/hooks/use-role-form"
import {
  getEditWithoutViewWarningMessage,
  hasEditWithoutViewPermission,
  normalizeRolePermissions,
} from "@/features/roles/lib/role-permissions"
import { dispatchRolesRefresh } from "@/lib/refresh-events"
import type { RoleFormValues, RoleRow } from "@/features/roles/types/roles"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

function createInitialValues(role: RoleRow): RoleFormValues {
  return {
    name: role.name,
    permissions: normalizeRolePermissions(role.permissions),
  }
}

export function EditRoleDialog({
  onOpenChange,
  role,
}: {
  onOpenChange?: (open: boolean) => void
  role: RoleRow
}) {
  const { session } = useAuth()
  const isAdminRole = role.name === SEEDED_ADMIN_ROLE_NAME
  const initialValues = React.useMemo(() => createInitialValues(role), [role])
  const { setName, setPermission, values } = useRoleForm(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setError("")
  }, [role])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to update a role."
      setError(message)
      toast.error(message)
      return
    }

    if (isAdminRole) {
      const message = "The admin role cannot be changed."
      setError(message)
      toast.error(message)
      return
    }

    if (hasEditWithoutViewPermission(values.permissions)) {
      toast.warning(getEditWithoutViewWarningMessage())
      return
    }

    setIsSubmitting(true)

    try {
      await updateRole(
        {
          id: role.id,
          name: values.name.trim(),
          permissions: values.permissions,
        },
        session.token
      )

      dispatchRolesRefresh()
      toast.success(`Updated role ${values.name.trim() || role.name}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update role right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-3xl"
      description="Update the role name and page permissions below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isAdminRole}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit role"
    >
      <RoleFormFields
        error={error}
        idPrefix={`edit-role-${role.id}`}
        isSubmitting={isSubmitting || isAdminRole}
        onNameChange={setName}
        onPermissionChange={setPermission}
        values={values}
      />
    </FormDialog>
  )
}
