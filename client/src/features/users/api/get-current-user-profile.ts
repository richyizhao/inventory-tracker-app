import { apiRequest } from "@/lib/api"
import type { CurrentUserProfile } from "@/features/users/types/users"

export function getCurrentUserProfile(token: string) {
  return apiRequest<CurrentUserProfile>("/users/profile", {
    token,
  })
}
