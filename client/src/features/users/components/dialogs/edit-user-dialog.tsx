import * as React from "react"

import { FormDialog } from "@/components/common/form-dialog"
import { SEEDED_ADMIN_USERNAME } from "@/config/app-config"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { UserFormFields } from "@/features/users/components/forms/user-form-fields"
import { useUserForm } from "@/features/users/hooks/use-user-form"
import { useUserRoles } from "@/features/users/hooks/use-user-roles"
import {
  createUserFormValuesFromUser,
  resolveSelectedUserRole,
} from "@/features/users/lib/user-form"
import { updateUser } from "@/features/users/api/update-user"
import { dispatchUsersRefresh } from "@/lib/refresh-events"
import type { User } from "@/features/users/types/users"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function EditUserDialog({
  onOpenChange,
  user,
}: {
  onOpenChange?: (open: boolean) => void
  user: User
}) {
  const { session } = useAuth()
  const isAdminUser = user.username.toLowerCase() === SEEDED_ADMIN_USERNAME
  const initialValues = React.useMemo(
    () => createUserFormValuesFromUser(user),
    [user]
  )
  const currentRoleOption = React.useMemo(
    () => ({
      id: user.roleId,
      name: user.roleName,
    }),
    [user.roleId, user.roleName]
  )
  const fallbackRoles = React.useMemo(
    () => [currentRoleOption],
    [currentRoleOption]
  )
  const { setField, values } = useUserForm(initialValues)
  const [isLoadingRoles, setIsLoadingRoles] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")
  const {
    roles,
    isLoadingRoles: isLoadingRolesFromHook,
    rolesError,
  } = useUserRoles({ fallbackRoles })

  React.useEffect(() => {
    setError("")
  }, [currentRoleOption, user])

  React.useEffect(() => {
    setIsLoadingRoles(isLoadingRolesFromHook)
  }, [isLoadingRolesFromHook])

  React.useEffect(() => {
    if (rolesError) {
      setError(rolesError)
    }
  }, [rolesError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to update a user."
      setError(message)
      toast.error(message)
      return
    }

    if (isAdminUser) {
      const message = "The seeded admin account cannot be changed."
      setError(message)
      toast.error(message)
      return
    }

    const selectedRole = resolveSelectedUserRole({
      fallbackRole: currentRoleOption,
      roles,
      selectedRoleName: values.selectedRoleName,
    })
    if (!selectedRole) {
      setError("Please select a role.")
      return
    }

    setIsSubmitting(true)

    try {
      await updateUser(
        {
          id: user.id,
          displayName: values.displayName,
          username: values.username,
          email: values.email,
          roleId: selectedRole.id,
          password: values.password || undefined,
        },
        session.token
      )

      dispatchUsersRefresh()
      toast.success(`Updated user ${values.username}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update user right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-md"
      description="Update the user details below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingRoles || isAdminUser}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit user"
    >
      <UserFormFields
        error={error}
        idPrefix={`edit-user-${user.id}`}
        isPasswordRequired={false}
        isLoadingRoles={isLoadingRoles}
        isSubmitting={isSubmitting || isAdminUser}
        onFieldChange={setField}
        roles={roles}
        values={values}
      />
    </FormDialog>
  )
}
