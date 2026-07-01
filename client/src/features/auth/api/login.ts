import { apiRequest } from "@/lib/api"
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth"

export function login(input: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
  })
}
