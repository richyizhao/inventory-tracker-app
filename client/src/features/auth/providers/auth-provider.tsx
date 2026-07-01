import * as React from "react"

import { login as loginRequest } from "@/features/auth/api/login"
import { createAuthSession } from "@/features/auth/lib/auth-session"
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "@/features/auth/lib/auth-storage"
import type {
  AuthContextValue,
  AuthSession,
  LoginRequest,
} from "@/features/auth/types/auth"

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<AuthSession | null>(null)
  const [isAuthReady, setIsAuthReady] = React.useState(false)
  const [isLoginPending, setIsLoginPending] = React.useState(false)

  React.useEffect(() => {
    setSession(readAuthSession())
    setIsAuthReady(true)
  }, [])

  const login = React.useCallback(async (input: LoginRequest) => {
    setIsLoginPending(true)

    try {
      const response = await loginRequest(input)
      const nextSession = createAuthSession(response, input)

      writeAuthSession(nextSession)
      setSession(nextSession)
      return nextSession
    } finally {
      setIsLoginPending(false)
    }
  }, [])

  const logout = React.useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const updateSessionUsername = React.useCallback((username: string) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession
      }

      const nextSession = {
        ...currentSession,
        username,
      }

      writeAuthSession(nextSession)
      return nextSession
    })
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthReady,
      isAuthenticated: session !== null,
      isLoginPending,
      login,
      logout,
      session,
      updateSessionUsername,
    }),
    [isAuthReady, isLoginPending, login, logout, session, updateSessionUsername]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.")
  }

  return context
}
