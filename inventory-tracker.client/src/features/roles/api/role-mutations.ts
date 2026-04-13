import { mutationOptions } from "@tanstack/react-query";

import {
  createRole,
  deleteRole,
  updateRolePermissions,
  type Role,
} from "@/features/roles/api/roles-api";

export function createRoleMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: (input: { name: string }) => createRole(token, input),
  });
}

export function updateRolePermissionsMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: string[];
    }): Promise<Role> =>
      updateRolePermissions(token, roleId, {
        permissions,
      }),
  });
}

export function deleteRoleMutationOptions(token: string) {
  return mutationOptions({
    mutationFn: ({ roleId }: { roleId: string }) => deleteRole(token, roleId),
  });
}
