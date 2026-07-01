import type {
  AuthSession,
  LoginRequest,
  LoginResponse,
} from "@/features/auth/types/auth"

export function createAuthSession(
  response: LoginResponse,
  request: Pick<LoginRequest, "username">
): AuthSession {
  return {
    token: response.token,
    username: request.username,
  }
}
