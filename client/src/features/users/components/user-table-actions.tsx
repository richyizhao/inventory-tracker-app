import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SEEDED_ADMIN_USERNAME } from "@/config/app-config"
import { DeleteUserDialog } from "@/features/users/components/dialogs/delete-user-dialog"
import { EditUserDialog } from "@/features/users/components/dialogs/edit-user-dialog"
import type { User } from "@/features/users/types/users"
import { PencilIcon, Trash2Icon } from "lucide-react"

export function UserTableActions({ user }: { user: User }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const isAdminUser = user.username.toLowerCase() === SEEDED_ADMIN_USERNAME

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              type="button"
              size="sm"
              disabled={isAdminUser}
            />
          }
        >
          <PencilIcon />
          Edit
        </DialogTrigger>
        <EditUserDialog user={user} onOpenChange={setIsEditOpen} />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger
          render={
            <Button
              variant="destructive"
              type="button"
              size="sm"
              disabled={isAdminUser}
            />
          }
        >
          <Trash2Icon />
          Delete
        </DialogTrigger>
        <DeleteUserDialog user={user} onOpenChange={setIsDeleteOpen} />
      </Dialog>
    </div>
  )
}
