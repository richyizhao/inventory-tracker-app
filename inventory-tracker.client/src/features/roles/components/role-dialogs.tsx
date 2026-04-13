
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { permissionGroups } from "@/config/permissions";
import type { Role } from "@/features/roles/api/roles-api";

type CreateRoleDialogProps = {
  draftName: string;
  isOpen: boolean;
  isSaving: boolean;
  onDraftNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateRoleDialog({
  draftName,
  isOpen,
  isSaving,
  onDraftNameChange,
  onOpenChange,
  onSubmit,
}: CreateRoleDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Add a new role that can later be assigned to users and configured
            with permissions.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="role-name">Name</Label>
            <Input
              id="role-name"
              onChange={(event) => onDraftNameChange(event.target.value)}
              placeholder="Auditor"
              value={draftName}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Creating..." : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type RolePermissionsDialogProps = {
  draftPermissions: string[];
  editingRole: Role | null;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onTogglePermission: (permissionId: string, enabled: boolean) => void;
};

export function RolePermissionsDialog({
  draftPermissions,
  editingRole,
  isSaving,
  onOpenChange,
  onSave,
  onTogglePermission,
}: RolePermissionsDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(editingRole)}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingRole
              ? `Edit permissions for ${editingRole.name}`
              : "Edit permissions"}
          </DialogTitle>
          <DialogDescription>
            Choose which pages this role can access and which operations it can
            perform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {permissionGroups.map((group) => (
            <section className="space-y-3" key={group.id}>
              <div>
                <h3 className="font-medium">{group.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.id === "pages"
                    ? "Use these to control navigation visibility and page access."
                    : "Use these to control the actions this role can perform."}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {group.permissions.map((permission) => {
                  const checked = draftPermissions.includes(permission.id);

                  return (
                    <label
                      className="flex items-start gap-3 rounded-2xl border p-4"
                      key={permission.id}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          onTogglePermission(permission.id, value === true)
                        }
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{permission.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button disabled={isSaving} onClick={onSave} type="button">
            {isSaving ? "Saving..." : "Save permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeleteRoleDialogProps = {
  isSaving: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  target: Role | null;
};

export function DeleteRoleDialog({
  isSaving,
  onConfirm,
  onOpenChange,
  target,
}: DeleteRoleDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={Boolean(target)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete role</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Delete ${target.name}? Built-in roles and roles with assigned users cannot be deleted.`
              : "Delete this role?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSaving}
            onClick={onConfirm}
            variant="destructive"
          >
            {isSaving ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
