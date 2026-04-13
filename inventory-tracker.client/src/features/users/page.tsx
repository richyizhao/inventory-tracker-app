import { Plus } from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import {
  DeleteUserDialog,
  SwitchRoleDialog,
  UserTextFieldDialog,
} from "@/features/users/components/user-action-dialogs";
import { UsersTable } from "@/features/users/components/users-table";
import { useUsersPage } from "@/features/users/hooks/use-users-page";

export function UsersPage() {
  const {
    canCreateUser,
    canDeleteUser,
    canEditUserEmail,
    canEditUserName,
    canManageUserPasswords,
    canSwitchUserRole,
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
    isSaving,
    name,
    nameTarget,
    newEmail,
    newPassword,
    openCreateDialog,
    password,
    passwordTarget,
    role,
    roleTarget,
    roles,
    setDeleteTarget,
    setEditName,
    setEmail,
    setEmailTarget,
    setIsCreateOpen,
    setName,
    setNameTarget,
    setNewEmail,
    setNewPassword,
    setPassword,
    setPasswordTarget,
    setRole,
    setRoleTarget,
    users,
  } = useUsersPage();

  usePageHeaderActions(
    canCreateUser ? (
      <Button onClick={openCreateDialog}>
        <Plus className="size-4" />
        Create user
      </Button>
    ) : null,
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1 max-md:text-center">
          Team
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Manage team accounts and access.
        </p>
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : (
            <UsersTable
              canDeleteUser={canDeleteUser}
              canEditUserEmail={canEditUserEmail}
              canEditUserName={canEditUserName}
              canManageUserPasswords={canManageUserPasswords}
              canSwitchUserRole={canSwitchUserRole}
              onDelete={setDeleteTarget}
              onEditEmail={(record) => {
                setEmailTarget(record);
                setNewEmail(record.email);
              }}
              onEditName={(record) => {
                setNameTarget(record);
                setEditName(record.name);
              }}
              onManagePassword={(record) => {
                setPasswordTarget(record);
                setNewPassword("");
              }}
              onSwitchRole={(record, defaultRole) => {
                setRoleTarget(record);
                setRole(defaultRole);
              }}
              roles={roles}
              users={users}
            />
          )}
        </CardContent>
      </Card>

      <CreateUserDialog
        email={email}
        isOpen={isCreateOpen}
        isSaving={isSaving}
        name={name}
        onEmailChange={setEmail}
        onNameChange={setName}
        onOpenChange={setIsCreateOpen}
        onPasswordChange={setPassword}
        onRoleChange={setRole}
        onSubmit={handleCreateUser}
        password={password}
        role={role}
        roles={roles}
      />

      <SwitchRoleDialog
        isSaving={isSaving}
        onOpenChange={(open) => {
          if (!open) {
            setRoleTarget(null);
          }
        }}
        onRoleChange={setRole}
        onSubmit={handleUpdateRole}
        open={Boolean(roleTarget)}
        role={role}
        roles={roles}
        target={roleTarget}
      />

      <UserTextFieldDialog
        description={nameTarget ? `Update the name for ${nameTarget.name}.` : ""}
        inputId="updated-name"
        isSaving={isSaving}
        label="Name"
        onOpenChange={(open) => {
          if (!open) {
            setNameTarget(null);
          }
        }}
        onSubmit={handleUpdateName}
        onValueChange={setEditName}
        open={Boolean(nameTarget)}
        title="Update name"
        value={editName}
      />

      <UserTextFieldDialog
        description={
          emailTarget ? `Change the email for ${emailTarget.name}.` : ""
        }
        inputId="updated-email"
        inputType="email"
        isSaving={isSaving}
        label="Email"
        onOpenChange={(open) => {
          if (!open) {
            setEmailTarget(null);
          }
        }}
        onSubmit={handleUpdateEmail}
        onValueChange={setNewEmail}
        open={Boolean(emailTarget)}
        title="Update email"
        value={newEmail}
      />

      <UserTextFieldDialog
        description={
          passwordTarget
            ? `Set a new password for ${passwordTarget.name}.`
            : ""
        }
        inputId="new-user-password"
        inputType="password"
        isSaving={isSaving}
        label="Password"
        onOpenChange={(open) => {
          if (!open) {
            setPasswordTarget(null);
          }
        }}
        onSubmit={handleChangePassword}
        onValueChange={setNewPassword}
        open={Boolean(passwordTarget)}
        title="Change password"
        value={newPassword}
      />

      <DeleteUserDialog
        isSaving={isSaving}
        onConfirm={confirmDeleteUser}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        open={Boolean(deleteTarget)}
        target={deleteTarget}
      />
    </div>
  );
}
