import { request } from "@/lib/http";

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
};

export function getRoles(token: string) {
  return request<Role[]>("/Roles", { token });
}

export function createRole(token: string, input: { name: string }) {
  return request<Role>("/Roles", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
}

export function updateRolePermissions(
  token: string,
  roleId: string,
  input: { permissions: string[] },
) {
  return request<Role>(`/Roles/${roleId}/permissions`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
}

export function deleteRole(token: string, roleId: string) {
  return request<void>(`/Roles/${roleId}`, {
    method: "DELETE",
    token,
  });
}
