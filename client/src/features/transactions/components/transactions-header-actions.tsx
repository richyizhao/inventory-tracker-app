import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateTransactionDialog } from "@/features/transactions/components/dialogs/create-transaction-dialog"
import { PlusIcon } from "lucide-react"

export function TransactionsHeaderActions() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  return (
    <div className="ml-auto flex items-center gap-2">
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add transaction
        </DialogTrigger>
        <CreateTransactionDialog onOpenChange={setIsCreateOpen} />
      </Dialog>
    </div>
  )
}
