import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  type Role,
} from "@/features/roles/api/roles-api";
import {
  createRoleMutationOptions,
  deleteRoleMutationOptions,
  updateRolePermissionsMutationOptions,
} from "@/features/roles/api/role-mutations";
import {
  emptyRolesQuery,
  getRolesQueryOptions,
  roleKeys,
} from "@/features/roles/api/role-queries";
import { hasPermission, permissionIds } from "@/config/permissions";

export function useRolesPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);

  const canViewRoles = hasPermission(user?.permissions, permissionIds.rolesView);
  const canCreateRole = hasPermission(user?.permissions, permissionIds.rolesCreate);
  const canDeleteRole = hasPermission(user?.permissions, permissionIds.rolesDelete);
  const canManageRolePermissions = hasPermission(
    user?.permissions,
    permissionIds.rolesManagePermissions,
  );

  const rolesQuery = useQuery({
    ...(token
      ? getRolesQueryOptions(token)
      : {
          queryKey: roleKeys.list(),
          queryFn: emptyRolesQuery,
        }),
    enabled: Boolean(token && canViewRoles),
  });
  const createRoleMutation = useMutation(
    token
      ? createRoleMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to create a role.");
          },
        },
  );
  const updateRolePermissionsMutation = useMutation(
    token
      ? updateRolePermissionsMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update role permissions.");
          },
        },
  );
  const deleteRoleMutation = useMutation(
    token
      ? deleteRoleMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to delete a role.");
          },
        },
  );

  const roles = rolesQuery.data ?? [];
  const isLoading = rolesQuery.isLoading;
  const error = rolesQuery.error instanceof Error ? rolesQuery.error.message : null;
  const isSaving =
    createRoleMutation.isPending ||
    updateRolePermissionsMutation.isPending ||
    deleteRoleMutation.isPending;

  async function refreshRoles() {
    await queryClient.invalidateQueries({ queryKey: roleKeys.all() });
  }

  async function handleCreateRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      await createRoleMutation.mutateAsync({ name: draftName });
      toast.success("Role created.");
      setDraftName("");
      setIsCreateOpen(false);
      await refreshRoles();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create role.",
      );
    }
  }

  function openPermissionsEditor(role: Role) {
    setEditingRole(role);
    setDraftPermissions(role.permissions);
  }

  function toggleDraftPermission(permissionId: string, enabled: boolean) {
    setDraftPermissions((current) => {
      if (enabled) {
        return current.includes(permissionId)
          ? current
          : [...current, permissionId].sort();
      }

      return current.filter((item) => item !== permissionId);
    });
  }

  async function saveRolePermissions() {
    if (!token || !editingRole) {
      return;
    }

    try {
      await updateRolePermissionsMutation.mutateAsync({
        roleId: editingRole.id,
        permissions: draftPermissions,
      });
      toast.success("Role permissions updated.");
      setEditingRole(null);
      await refreshRoles();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update role permissions.",
      );
    }
  }

  async function confirmDeleteRole() {
    if (!token || !deleteTarget) {
      return;
    }

    try {
      await deleteRoleMutation.mutateAsync({ roleId: deleteTarget.id });
      toast.success("Role deleted.");
      setDeleteTarget(null);
      await refreshRoles();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete role.",
      );
    }
  }

  return {
    canCreateRole,
    canDeleteRole,
    canManageRolePermissions,
    canViewRoles,
    confirmDeleteRole,
    deleteTarget,
    draftName,
    draftPermissions,
    editingRole,
    error,
    handleCreateRole,
    isCreateOpen,
    isLoading,
    isSaving,
    openPermissionsEditor,
    roles,
    saveRolePermissions,
    setDeleteTarget,
    setDraftName,
    setEditingRole,
    setIsCreateOpen,
    toggleDraftPermission,
  };
}
