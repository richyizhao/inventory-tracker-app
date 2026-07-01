import { useUserRoles } from "@/features/users/hooks/use-user-roles"

export function useUserRoleOptions() {
  const { roles } = useUserRoles()

  return {
    roles,
  }
}
