import type { PagedLoadState } from "@/types/load-state"
import type { PagedResponse } from "@/types/pagination"

export type User = {
  id: number
  displayName: string
  username: string
  email: string
  roleId: number
  roleName: string
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type UserSort = "newest" | "updated"

export type UserFormValues = {
  displayName: string
  username: string
  email: string
  selectedRoleName: string
  password: string
}

export type CurrentUserProfile = {
  displayName: string
  username: string
  email: string
  updatedAtUtc: string | null
}

export type PagedUsersResponse = PagedResponse<User>

export type UsersLoadState = PagedLoadState<User, "users">
