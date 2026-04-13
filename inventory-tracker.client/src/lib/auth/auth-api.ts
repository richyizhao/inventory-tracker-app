import { request } from "@/lib/http";

import type {
  AuthResponse,
  AuthUser,
  UpdateProfileInput,
} from "@/lib/auth/types";

export function login(email: string, password: string) {
  return request<AuthResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser(token: string) {
  return request<AuthUser>("/Users/me", { token });
}

export function updateProfile(token: string, input: UpdateProfileInput) {
  return request<AuthResponse>("/Users/me/profile", {
    method: "PUT",
    token,
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      currentPassword: input.currentPassword,
      newPassword: input.newPassword ?? "",
    }),
  });
}
