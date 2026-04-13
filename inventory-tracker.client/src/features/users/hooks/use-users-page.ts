import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import { passwordSchema } from "@/lib/validation/password";
import {
  type UserRecord,
} from "@/features/users/api/users-api";
import {
  changeUserPasswordMutationOptions,
  createUserMutationOptions,
  deleteUserMutationOptions,
  updateUserEmailMutationOptions,
  updateUserNameMutationOptions,
  updateUserRoleMutationOptions,
} from "@/features/users/api/users-mutations";
import {
  emptyUserRolesQuery,
  emptyUsersQuery,
  getUserRolesQueryOptions,
  getUsersQueryOptions,
  userKeys,
} from "@/features/users/api/users-queries";
import { hasPermission, permissionIds } from "@/config/permissions";

export function useUsersPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState<UserRecord | null>(null);
  const [nameTarget, setNameTarget] = useState<UserRecord | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<UserRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [roleTarget, setRoleTarget] = useState<UserRecord | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const canViewUsers = hasPermission(user?.permissions, permissionIds.usersView);
  const canCreateUser = hasPermission(user?.permissions, permissionIds.usersCreate);
  const canDeleteUser = hasPermission(user?.permissions, permissionIds.usersDelete);
  const canEditUserName = hasPermission(
    user?.permissions,
    permissionIds.usersEditName,
  );
  const canEditUserEmail = hasPermission(
    user?.permissions,
    permissionIds.usersEditEmail,
  );
  const canManageUserPasswords = hasPermission(
    user?.permissions,
    permissionIds.usersManagePasswords,
  );
  const canSwitchUserRole = hasPermission(
    user?.permissions,
    permissionIds.usersSwitchRole,
  );

  const usersQuery = useQuery({
    ...(token
      ? getUsersQueryOptions(token)
      : {
          queryKey: userKeys.list(),
          queryFn: emptyUsersQuery,
        }),
    enabled: Boolean(token && canViewUsers),
  });
  const rolesQuery = useQuery({
    ...(token
      ? getUserRolesQueryOptions(token)
      : {
          queryKey: userKeys.roles(),
          queryFn: emptyUserRolesQuery,
        }),
    enabled: Boolean(token && canViewUsers),
  });
  const createUserMutation = useMutation(
    token
      ? createUserMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to create a user.");
          },
        },
  );
  const updateUserEmailMutation = useMutation(
    token
      ? updateUserEmailMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update email.");
          },
        },
  );
  const updateUserNameMutation = useMutation(
    token
      ? updateUserNameMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update name.");
          },
        },
  );
  const changeUserPasswordMutation = useMutation(
    token
      ? changeUserPasswordMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update passwords.");
          },
        },
  );
  const updateUserRoleMutation = useMutation(
    token
      ? updateUserRoleMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update roles.");
          },
        },
  );
  const deleteUserMutation = useMutation(
    token
      ? deleteUserMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to delete users.");
          },
        },
  );

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const isLoading = usersQuery.isLoading || rolesQuery.isLoading;
  const error =
    (usersQuery.error instanceof Error && usersQuery.error.message) ||
    (rolesQuery.error instanceof Error && rolesQuery.error.message) ||
    null;
  const isSaving =
    createUserMutation.isPending ||
    updateUserEmailMutation.isPending ||
    updateUserNameMutation.isPending ||
    changeUserPasswordMutation.isPending ||
    updateUserRoleMutation.isPending ||
    deleteUserMutation.isPending;
  const resolvedRole = role || roles[0]?.name || "";

  async function refreshUsers() {
    await queryClient.invalidateQueries({ queryKey: userKeys.all() });
  }

  function openCreateDialog() {
    setName("");
    setEmail("");
    setPassword("");
    setRole(resolvedRole);
    setIsCreateOpen(true);
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name,
        email,
        password,
        role: resolvedRole,
      });
      toast.success("User created.");
      setIsCreateOpen(false);
      await refreshUsers();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create user.",
      );
    }
  }

  async function handleUpdateEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !emailTarget) {
      return;
    }

    try {
      await updateUserEmailMutation.mutateAsync({
        userId: emailTarget.id,
        email: newEmail,
      });
      toast.success("User email updated.");
      setEmailTarget(null);
      await refreshUsers();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update email.",
      );
    }
  }

  async function handleUpdateName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !nameTarget) {
      return;
    }

    try {
      await updateUserNameMutation.mutateAsync({
        userId: nameTarget.id,
        name: editName,
      });
      toast.success("User name updated.");
      setNameTarget(null);
      await refreshUsers();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update name.",
      );
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !passwordTarget) {
      return;
    }

    const passwordResult = passwordSchema.safeParse(newPassword);

    if (!passwordResult.success) {
      toast.error(
        passwordResult.error.issues[0]?.message ?? "Invalid password.",
      );
      return;
    }

    try {
      await changeUserPasswordMutation.mutateAsync({
        userId: passwordTarget.id,
        newPassword,
      });
      toast.success("Password updated.");
      setPasswordTarget(null);
      setNewPassword("");
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update password.",
      );
    }
  }

  async function confirmDeleteUser() {
    if (!token || !deleteTarget) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync({ userId: deleteTarget.id });
      toast.success("User deleted.");
      setDeleteTarget(null);
      await refreshUsers();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete user.",
      );
    }
  }

  async function handleUpdateRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !roleTarget) {
      return;
    }

    try {
      await updateUserRoleMutation.mutateAsync({
        userId: roleTarget.id,
        role: resolvedRole,
      });
      toast.success("User role updated.");
      setRoleTarget(null);
      await refreshUsers();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update user role.",
      );
    }
  }

  return {
    canCreateUser,
    canDeleteUser,
    canEditUserEmail,
    canEditUserName,
    canManageUserPasswords,
    canSwitchUserRole,
    canViewUsers,
    confirmDeleteUser,
    deleteTarget,
    email,
    emailTarget,
    editName,
    error,
    handleChangePassword,
    handleCreateUser,
    handleUpdateEmail,
    handleUpdateName,
    handleUpdateRole,
    isCreateOpen,
    isLoading,
    isProfileOpen,
    isSaving,
    name,
    nameTarget,
    newEmail,
    newPassword,
    openCreateDialog,
    password,
    passwordTarget,
    role: resolvedRole,
    roleTarget,
    roles,
    setDeleteTarget,
    setEditName,
    setEmail,
    setEmailTarget,
    setIsCreateOpen,
    setIsProfileOpen,
    setName,
    setNameTarget,
    setNewEmail,
    setNewPassword,
    setPassword,
    setPasswordTarget,
    setRole,
    setRoleTarget,
    user,
    users,
  };
}
