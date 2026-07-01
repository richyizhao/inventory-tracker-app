import * as React from "react"

import { ConfirmDialog } from "@/components/custom/confirm-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteSubCategory } from "@/features/categories/api/delete-sub-category"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import type { CategorySubCategory } from "@/features/categories/types/categories"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteSubCategoryDialog({
  onOpenChange,
  subCategory,
}: {
  onOpenChange?: (open: boolean) => void
  subCategory: CategorySubCategory
}) {
  const { session } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      const message = "You need to be signed in to delete a sub-category."
      toast.error(message)
      return
    }

    setIsSubmitting(true)

    try {
      await deleteSubCategory(subCategory.id, session.token)
      dispatchCategoriesRefresh()
      toast.success(`Deleted sub-category ${subCategory.name}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete sub-category right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={<>Are you sure you want to delete {subCategory.name}?</>}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Delete sub-category"
      submittingLabel="Deleting..."
      title="Delete sub-category"
    />
  )
}
