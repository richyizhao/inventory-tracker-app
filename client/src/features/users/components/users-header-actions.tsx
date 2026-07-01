import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateUserDialog } from "@/features/users/components/dialogs/create-user-dialog"
import { PlusIcon } from "lucide-react"

export function UsersHeaderActions() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="ml-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add user
        </DialogTrigger>
        <CreateUserDialog onOpenChange={setOpen} />
      </Dialog>
    </div>
  )
}
