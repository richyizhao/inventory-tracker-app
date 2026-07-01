import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { TransactionFormFields } from "@/features/transactions/components/forms/transaction-form-fields"
import { updateTransaction } from "@/features/transactions/api/update-transaction"
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form"
import { useTransactionOptions } from "@/features/transactions/hooks/use-transaction-options"
import {
  createTransactionFormValuesFromTransaction,
  findSelectedTransactionProduct,
  findSelectedTransactionUser,
  toTransactionTypeApiValue,
} from "@/features/transactions/lib/transaction-form"
import { dispatchTransactionsRefresh } from "@/lib/refresh-events"
import type { Transaction } from "@/features/transactions/types/transactions"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function EditTransactionDialog({
  onOpenChange,
  transaction,
}: {
  onOpenChange?: (open: boolean) => void
  transaction: Transaction
}) {
  const { session } = useAuth()
  const initialValues = React.useMemo(
    () => createTransactionFormValuesFromTransaction(transaction),
    [transaction]
  )
  const { isLoadingOptions, optionsError, products, users } = useTransactionOptions()
  const { setField, values } = useTransactionForm(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setError("")
  }, [transaction])

  React.useEffect(() => {
    if (optionsError) {
      setError(optionsError)
    }
  }, [optionsError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to update a transaction."
      setError(message)
      toast.error(message)
      return
    }

    const selectedProduct = findSelectedTransactionProduct({
      products,
      selectedProductName: values.selectedProductName,
    })
    const selectedUser = findSelectedTransactionUser({
      selectedUsername: values.selectedUsername,
      users,
    })

    if (!selectedProduct) {
      setError("Please select a product.")
      return
    }

    if (!selectedUser) {
      setError("Please select a user.")
      return
    }

    setIsSubmitting(true)

    try {
      await updateTransaction(
        {
          id: transaction.id,
          productId: selectedProduct.id,
          userId: selectedUser.id,
          type: toTransactionTypeApiValue(values.type),
          productQuantityChanged: Number(values.productQuantityChanged),
          unitProductCost: Number(values.unitProductCost),
          note: values.note.trim() || undefined,
        },
        session.token
      )

      dispatchTransactionsRefresh()
      toast.success("Updated transaction")
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update transaction right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-2xl"
      description="Update the transaction details below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingOptions}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit transaction"
    >
      <TransactionFormFields
        error={error}
        idPrefix={`edit-transaction-${transaction.id}`}
        isLoadingOptions={isLoadingOptions}
        isSubmitting={isSubmitting}
        onFieldChange={setField}
        products={products}
        users={users}
        values={values}
      />
    </FormDialog>
  )
}
