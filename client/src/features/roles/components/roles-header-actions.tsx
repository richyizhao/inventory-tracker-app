import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateRoleDialog } from "@/features/roles/components/dialogs/create-role-dialog"
import { PlusIcon } from "lucide-react"

export function RolesHeaderActions() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="ml-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add role
        </DialogTrigger>
        <CreateRoleDialog onOpenChange={setOpen} />
      </Dialog>
    </div>
  )
}
