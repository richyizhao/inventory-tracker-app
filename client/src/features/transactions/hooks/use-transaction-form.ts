import { useFormState } from "@/hooks/use-form-state"
import type { TransactionFormValues } from "@/features/transactions/types/transactions"

export function useTransactionForm(initialValues: TransactionFormValues) {
  return useFormState(initialValues)
}
