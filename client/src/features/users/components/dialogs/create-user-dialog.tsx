import * as React from "react"

import { FormDialog } from "@/components/common/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createUser } from "@/features/users/api/create-user"
import { UserFormFields } from "@/features/users/components/forms/user-form-fields"
import { useUserForm } from "@/features/users/hooks/use-user-form"
import { useUserRoles } from "@/features/users/hooks/use-user-roles"
import {
  createEmptyUserFormValues,
  resolveSelectedUserRole,
} from "@/features/users/lib/user-form"
import { dispatchUsersRefresh } from "@/lib/refresh-events"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const initialFormValues = createEmptyUserFormValues()

export function CreateUserDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const { setField, setValues, values } = useUserForm(initialFormValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")
  const { roles, isLoadingRoles, rolesError } = useUserRoles()

  React.useEffect(() => {
    if (rolesError) {
      setError(rolesError)
    }
  }, [rolesError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a user."
      setError(message)
      toast.error(message)
      return
    }

    const selectedRole = resolveSelectedUserRole({
      roles,
      selectedRoleName: values.selectedRoleName,
    })

    if (!selectedRole) {
      const message = "Please select a role."
      setError(message)
      return
    }

    if (!values.password.trim()) {
      const message = "Password is required."
      setError(message)
      return
    }

    setIsSubmitting(true)

    try {
      await createUser(
        {
          displayName: values.displayName,
          username: values.username,
          email: values.email,
          roleId: selectedRole.id,
          password: values.password,
        },
        session.token
      )

      dispatchUsersRefresh()
      toast.success(`Created user ${values.username}`)
      onOpenChange?.(false)
      setValues(initialFormValues)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create user right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-md"
      description="Fill out the details below to create a new user account."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingRoles}
      submitLabel="Create user"
      submittingLabel="Creating..."
      title="Create user"
    >
      <UserFormFields
        error={error}
        idPrefix="create-user"
        isPasswordRequired
        isLoadingRoles={isLoadingRoles}
        isSubmitting={isSubmitting}
        onFieldChange={setField}
        roles={roles}
        values={values}
      />
    </FormDialog>
  )
}
