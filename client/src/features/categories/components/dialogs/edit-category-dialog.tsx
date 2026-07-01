import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { CategoryFormFields } from "@/features/categories/components/forms/category-form-fields"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { updateCategory } from "@/features/categories/api/update-category"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import type { Category } from "@/features/categories/types/categories"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function EditCategoryDialog({
  category,
  onOpenChange,
}: {
  category: Category
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const [name, setName] = React.useState(category.name)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setName(category.name)
    setError("")
  }, [category])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to update a category."
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
      await updateCategory(
        {
          id: category.id,
          name: name.trim(),
        },
        session.token
      )
      dispatchCategoriesRefresh()
      toast.success(`Updated category ${name.trim()}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update category right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-sm"
      description="Update the category name below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit category"
    >
      <CategoryFormFields
        error={error}
        id={`edit-category-name-${category.id}`}
        isSubmitting={isSubmitting}
        name={name}
        onNameChange={setName}
      />
    </FormDialog>
  )
}
