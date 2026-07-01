import type { UserRoleOption } from "@/features/roles/types/roles"
import type { User, UserFormValues } from "@/features/users/types/users"

export function createEmptyUserFormValues(): UserFormValues {
  return {
    displayName: "",
    username: "",
    email: "",
    selectedRoleName: "",
    password: "",
  }
}

export function createUserFormValuesFromUser(user: User): UserFormValues {
  return {
    displayName: user.displayName,
    username: user.username,
    email: user.email,
    selectedRoleName: user.roleName,
    password: "",
  }
}

export function resolveSelectedUserRole({
  fallbackRole,
  roles,
  selectedRoleName,
}: {
  fallbackRole?: UserRoleOption
  roles: UserRoleOption[]
  selectedRoleName: string
}) {
  return (
    roles.find((role) => role.name === selectedRoleName) ??
    (fallbackRole?.name === selectedRoleName ? fallbackRole : undefined)
  )
}
