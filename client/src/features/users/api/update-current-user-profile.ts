import { apiRequest } from "@/lib/api"

export function updateCurrentUserProfile(
  {
    displayName,
    username,
    email,
    password,
  }: {
    displayName: string
    username: string
    email: string
    password?: string
  },
  token: string
) {
  return apiRequest<void>("/users/profile", {
    method: "PUT",
    body: {
      displayName,
      username,
      email,
      password,
    },
    token,
  })
}
