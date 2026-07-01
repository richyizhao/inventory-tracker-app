import type { AuthSession } from "@/features/auth/types/auth"

const AUTH_SESSION_STORAGE_KEY = "inventory-tracker.auth-session"

export function readAuthSession() {
  if (typeof window === "undefined") {
    return null
  }

  const value = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthSession
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    return null
  }
}

export function writeAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}
