import { useFormState } from "@/hooks/use-form-state"
import type { UserFormValues } from "@/features/users/types/users"

export function useUserForm(initialValues: UserFormValues) {
  return useFormState(initialValues)
}
