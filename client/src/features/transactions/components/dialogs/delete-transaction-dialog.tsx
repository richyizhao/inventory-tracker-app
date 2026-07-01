import * as React from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteTransaction } from "@/features/transactions/api/delete-transaction"
import { dispatchTransactionsRefresh } from "@/lib/refresh-events"
import type { Transaction } from "@/features/transactions/types/transactions"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteTransactionDialog({
  onOpenChange,
  transaction,
}: {
  onOpenChange?: (open: boolean) => void
  transaction: Transaction
}) {
  const { session } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      const message = "You need to be signed in to delete a transaction."
      toast.error(message)
      return
    }

    setIsSubmitting(true)

    try {
      await deleteTransaction(transaction.id, session.token)
      dispatchTransactionsRefresh()
      toast.success("Deleted transaction")
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete transaction right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={
        <>
          Are you sure you want to delete this transaction for{" "}
          {transaction.productName}?
        </>
      }
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Delete transaction"
      submittingLabel="Deleting..."
      title="Delete transaction"
    />
  )
}
