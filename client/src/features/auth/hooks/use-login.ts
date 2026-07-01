import { useAuth } from "@/features/auth/hooks/use-auth"

export function useLogin() {
  const { login, isLoginPending } = useAuth()

  return {
    login,
    isLoginPending,
  }
}
