import { useAuth } from "@/features/auth/hooks/use-auth"

export function useLogout() {
  const { logout, session } = useAuth()

  return {
    logout,
    session,
  }
}
