import { request } from "@/lib/http";

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roles: string[];
  permissions: string[];
};

export function getUsers(token: string) {
  return request<UserRecord[]>("/Users", { token });
}

export function getRoles(token: string) {
  return request<Role[]>("/Roles", { token });
}

export function createUser(
  token: string,
  input: {
    name: string;
    email: string;
    password: string;
    role: string;
  },
) {
  return request<UserRecord>("/Auth/register", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateUserEmail(
  token: string,
  userId: string,
  input: { email: string },
) {
  return request<void>(`/Users/${userId}/email`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function updateUserName(
  token: string,
  userId: string,
  input: { name: string },
) {
  return request<void>(`/Users/${userId}/name`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function updateUserRole(
  token: string,
  userId: string,
  input: { role: string },
) {
  return request<void>(`/Users/${userId}/role`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function changeUserPassword(
  token: string,
  userId: string,
  input: { newPassword: string },
) {
  return request<void>(`/Users/${userId}/password`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteUser(token: string, userId: string) {
  return request<void>(`/Users/${userId}`, {
    method: "DELETE",
    token,
  });
}
