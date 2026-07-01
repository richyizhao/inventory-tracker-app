import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SEEDED_ADMIN_ROLE_NAME } from "@/config/app-config"
import { DeleteRoleDialog } from "@/features/roles/components/dialogs/delete-role-dialog"
import { EditRoleDialog } from "@/features/roles/components/dialogs/edit-role-dialog"
import type { RoleRow } from "@/features/roles/types/roles"
import { PencilIcon, Trash2Icon } from "lucide-react"

export function RoleTableActions({ role }: { role: RoleRow }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const isAdminRole = role.name === SEEDED_ADMIN_ROLE_NAME

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              type="button"
              size="sm"
              disabled={isAdminRole}
            />
          }
        >
          <PencilIcon />
          Edit
        </DialogTrigger>
        <EditRoleDialog role={role} onOpenChange={setIsEditOpen} />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger
          render={
            <Button
              variant="destructive"
              type="button"
              size="sm"
              disabled={isAdminRole}
            />
          }
        >
          <Trash2Icon />
          Delete
        </DialogTrigger>
        <DeleteRoleDialog role={role} onOpenChange={setIsDeleteOpen} />
      </Dialog>
    </div>
  )
}
