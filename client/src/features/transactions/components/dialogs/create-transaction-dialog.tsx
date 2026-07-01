import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createTransaction } from "@/features/transactions/api/create-transaction"
import { TransactionFormFields } from "@/features/transactions/components/forms/transaction-form-fields"
import { useTransactionForm } from "@/features/transactions/hooks/use-transaction-form"
import { useTransactionOptions } from "@/features/transactions/hooks/use-transaction-options"
import {
  createEmptyTransactionFormValues,
  findSelectedTransactionProduct,
  findSelectedTransactionUser,
  toTransactionTypeApiValue,
} from "@/features/transactions/lib/transaction-form"
import { dispatchTransactionsRefresh } from "@/lib/refresh-events"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const initialValues = createEmptyTransactionFormValues()

export function CreateTransactionDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const { isLoadingOptions, optionsError, products, users } = useTransactionOptions()
  const { setField, setValues, values } = useTransactionForm(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (optionsError) {
      setError(optionsError)
    }
  }, [optionsError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a transaction."
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
      await createTransaction(
        {
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
      toast.success(`Recorded ${values.type.toLowerCase()} transaction`)
      onOpenChange?.(false)
      setValues(initialValues)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create transaction right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-2xl"
      description="Fill out the details below to record a product movement."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingOptions}
      submitLabel="Record movement"
      submittingLabel="Creating..."
      title="Record movement"
    >
      <TransactionFormFields
        error={error}
        idPrefix="create-transaction"
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
