
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role, UserRecord } from "@/features/users/api/users-api";

type TextFieldDialogProps = {
  description: string;
  inputId: string;
  inputType?: "email" | "password" | "text";
  isSaving: boolean;
  label: string;
  open: boolean;
  title: string;
  value: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onValueChange: (value: string) => void;
};

export function UserTextFieldDialog({
  description,
  inputId,
  inputType = "text",
  isSaving,
  label,
  open,
  title,
  value,
  onOpenChange,
  onSubmit,
  onValueChange,
}: TextFieldDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor={inputId}>{label}</Label>
            <Input
              id={inputId}
              onChange={(event) => onValueChange(event.target.value)}
              type={inputType}
              value={value}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : `Save ${label.toLowerCase()}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type SwitchRoleDialogProps = {
  isSaving: boolean;
  open: boolean;
  role: string;
  roles: Role[];
  target: UserRecord | null;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function SwitchRoleDialog({
  isSaving,
  open,
  role,
  roles,
  target,
  onOpenChange,
  onRoleChange,
  onSubmit,
}: SwitchRoleDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch role</DialogTitle>
          <DialogDescription>
            {target ? `Assign a new role to ${target.name}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              onValueChange={(value) => onRoleChange(String(value ?? ""))}
              value={role}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((roleOption) => (
                  <SelectItem key={roleOption.id} value={roleOption.name}>
                    {roleOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : "Switch role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteUserDialogProps = {
  isSaving: boolean;
  open: boolean;
  target: UserRecord | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserDialog({
  isSaving,
  open,
  target,
  onConfirm,
  onOpenChange,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `Delete ${target.name}? This removes the account from the system.`
              : "Delete this user?"}
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
