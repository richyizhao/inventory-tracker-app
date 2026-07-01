import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DeleteTransactionDialog } from "@/features/transactions/components/dialogs/delete-transaction-dialog"
import { EditTransactionDialog } from "@/features/transactions/components/dialogs/edit-transaction-dialog"
import type { Transaction } from "@/features/transactions/types/transactions"
import { PencilIcon, Trash2Icon } from "lucide-react"

export function TransactionTableActions({
  transaction,
}: {
  transaction: Transaction
}) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PencilIcon />
          Edit
        </DialogTrigger>
        <EditTransactionDialog
          transaction={transaction}
          onOpenChange={setIsEditOpen}
        />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger
          render={<Button variant="destructive" type="button" size="sm" />}
        >
          <Trash2Icon />
          Delete
        </DialogTrigger>
        <DeleteTransactionDialog
          transaction={transaction}
          onOpenChange={setIsDeleteOpen}
        />
      </Dialog>
    </div>
  )
}
