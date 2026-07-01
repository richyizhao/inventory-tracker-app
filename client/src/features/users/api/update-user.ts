import { apiRequest } from "@/lib/api"

export type UpdateUserRequest = {
  id: number
  displayName: string
  username: string
  email: string
  roleId: number
  password?: string
}

export function updateUser(input: UpdateUserRequest, token: string) {
  return apiRequest<void>("/users", {
    method: "PUT",
    body: input,
    token,
  })
}
