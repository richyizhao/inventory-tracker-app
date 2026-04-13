import { Plus } from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreateRoleDialog,
  DeleteRoleDialog,
  RolePermissionsDialog,
} from "@/features/roles/components/role-dialogs";
import { RolesTable } from "@/features/roles/components/roles-table";
import { useRolesPage } from "@/features/roles/hooks/use-roles-page";

export function RolesPage() {
  const {
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
  } = useRolesPage();

  usePageHeaderActions(
    canCreateRole ? (
      <Button onClick={() => setIsCreateOpen(true)}>
        <Plus className="size-4" />
        Create role
      </Button>
    ) : null,
    [canCreateRole, setIsCreateOpen],
  );

  if (!canViewRoles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            This page is only available to roles with role visibility access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1 max-md:text-center">
          Permissions
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Control role access and permissions.
        </p>
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Loading roles...</p>
          ) : (
            <RolesTable
              canDeleteRole={canDeleteRole}
              canManageRolePermissions={canManageRolePermissions}
              onDelete={setDeleteTarget}
              onEditPermissions={openPermissionsEditor}
              roles={roles}
            />
          )}
        </CardContent>
      </Card>

      <CreateRoleDialog
        draftName={draftName}
        isOpen={isCreateOpen}
        isSaving={isSaving}
        onDraftNameChange={setDraftName}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateRole}
      />

      <RolePermissionsDialog
        draftPermissions={draftPermissions}
        editingRole={editingRole}
        isSaving={isSaving}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRole(null);
          }
        }}
        onSave={saveRolePermissions}
        onTogglePermission={toggleDraftPermission}
      />

      <DeleteRoleDialog
        isSaving={isSaving}
        onConfirm={confirmDeleteRole}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        target={deleteTarget}
      />
    </div>
  );
}
