import { useFormState } from "@/hooks/use-form-state"
import type { ProductFormValues } from "@/features/products/types/products"

export function useProductForm(initialValues: ProductFormValues) {
  return useFormState(initialValues)
}
