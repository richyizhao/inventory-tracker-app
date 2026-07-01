import { apiRequest } from "@/lib/api"

export type CreateUserRequest = {
  displayName: string
  username: string
  email: string
  roleId: number
  password: string
}

type CreateUserResponse = {
  id: number
}

export function createUser(input: CreateUserRequest, token: string) {
  return apiRequest<CreateUserResponse>("/users", {
    method: "POST",
    body: input,
    token,
  })
}
