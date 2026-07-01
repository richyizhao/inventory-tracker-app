import * as React from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteCategory } from "@/features/categories/api/delete-category"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import type { Category } from "@/features/categories/types/categories"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteCategoryDialog({
  category,
  onOpenChange,
}: {
  category: Category
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      const message = "You need to be signed in to delete a category."
      toast.error(message)
      return
    }

    setIsSubmitting(true)

    try {
      await deleteCategory(category.id, session.token)
      dispatchCategoriesRefresh()
      toast.success(`Deleted category ${category.name}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete category right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={
        <>
          Are you sure you want to delete {category.name} and its
          sub-categories?
        </>
      }
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Delete category"
      submittingLabel="Deleting..."
      title="Delete category"
    />
  )
}
