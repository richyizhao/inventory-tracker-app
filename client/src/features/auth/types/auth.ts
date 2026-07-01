export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type SignupRequest = {
  username: string
  password: string
  name: string
  email: string
}

export type SignupResponse = {
  token: string
}

export type AuthSession = {
  token: string
  username: string
}

export type AuthContextValue = {
  isAuthReady: boolean
  isAuthenticated: boolean
  isLoginPending: boolean
  login: (input: LoginRequest) => Promise<AuthSession>
  logout: () => void
  session: AuthSession | null
  updateSessionUsername: (username: string) => void
}
