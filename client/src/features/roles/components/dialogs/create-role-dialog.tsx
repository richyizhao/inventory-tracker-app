import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createRole } from "@/features/roles/api/create-role"
import { RoleFormFields } from "@/features/roles/components/forms/role-form-fields"
import { useRoleForm } from "@/features/roles/hooks/use-role-form"
import {
  getEditWithoutViewWarningMessage,
  hasEditWithoutViewPermission,
  normalizeRolePermissions,
} from "@/features/roles/lib/role-permissions"
import { dispatchRolesRefresh } from "@/lib/refresh-events"
import type { RoleFormValues } from "@/features/roles/types/roles"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const initialFormValues: RoleFormValues = {
  name: "",
  permissions: normalizeRolePermissions([]),
}

export function CreateRoleDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const { setName, setPermission, setValues, values } = useRoleForm(initialFormValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a role."
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
      await createRole(
        {
          name: values.name.trim(),
          permissions: values.permissions,
        },
        session.token
      )

      dispatchRolesRefresh()
      toast.success(`Created role ${values.name.trim()}`)
      onOpenChange?.(false)
      setValues(initialFormValues)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create role right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-2xl"
      description="Fill out the role name and permissions below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Create role"
      submittingLabel="Creating..."
      title="Create role"
    >
      <RoleFormFields
        error={error}
        idPrefix="create-role"
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onPermissionChange={setPermission}
        values={values}
      />
    </FormDialog>
  )
}
