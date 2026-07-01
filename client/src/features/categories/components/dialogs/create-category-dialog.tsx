import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { CategoryFormFields } from "@/features/categories/components/forms/category-form-fields"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createCategory } from "@/features/categories/api/create-category"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function CreateCategoryDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const [name, setName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a category."
      setError(message)
      toast.error(message)
      return
    }

    if (!name.trim()) {
      setError("Category name is required.")
      return
    }

    setIsSubmitting(true)

    try {
      await createCategory(name.trim(), session.token)
      dispatchCategoriesRefresh()
      toast.success(`Created category ${name.trim()}`)
      onOpenChange?.(false)
      setName("")
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create category right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-sm"
      description="Create a new category."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Add category"
      submittingLabel="Creating..."
      title="Add category"
    >
      <CategoryFormFields
        error={error}
        id="create-category-name"
        isSubmitting={isSubmitting}
        name={name}
        onNameChange={setName}
      />
    </FormDialog>
  )
}
