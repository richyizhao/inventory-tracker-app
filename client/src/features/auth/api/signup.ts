import { apiRequest } from "@/lib/api"
import type { SignupRequest, SignupResponse } from "@/features/auth/types/auth"

export function signup(input: SignupRequest) {
  return apiRequest<SignupResponse>("/auth/signup", {
    method: "POST",
    body: input,
  })
}
