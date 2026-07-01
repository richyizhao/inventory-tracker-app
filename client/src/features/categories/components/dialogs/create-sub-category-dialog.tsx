import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { SubCategoryFormFields } from "@/features/categories/components/forms/sub-category-form-fields"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createSubCategory } from "@/features/categories/api/create-sub-category"
import { useCategoriesTable } from "@/features/categories/hooks/use-categories-table"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function CreateSubCategoryDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const { loadState } = useCategoriesTable()
  const [name, setName] = React.useState("")
  const [selectedCategoryName, setSelectedCategoryName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  const categories =
    loadState.status === "success" ? loadState.categories : []

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a sub-category."
      setError(message)
      toast.error(message)
      return
    }

    const selectedCategory = categories.find(
      (category) => category.name === selectedCategoryName
    )

    if (!selectedCategory) {
      setError("Please select a category.")
      return
    }

    if (!name.trim()) {
      setError("Sub-category name is required.")
      return
    }

    setIsSubmitting(true)

    try {
      await createSubCategory(
        {
          categoryId: selectedCategory.id,
          name: name.trim(),
        },
        session.token
      )
      dispatchCategoriesRefresh()
      toast.success(`Created sub-category ${name.trim()}`)
      onOpenChange?.(false)
      setName("")
      setSelectedCategoryName("")
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create sub-category right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-sm"
      description="Create a sub-category under an existing category."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || loadState.status !== "success"}
      submitLabel="Add sub-category"
      submittingLabel="Creating..."
      title="Add sub-category"
    >
      <SubCategoryFormFields
        categories={categories}
        categoryFieldId="create-sub-category-category"
        error={error}
        isCategoryDisabled={isSubmitting || loadState.status !== "success"}
        isSubmitting={isSubmitting}
        name={name}
        nameId="create-sub-category-name"
        selectedCategoryName={selectedCategoryName}
        onCategoryChange={setSelectedCategoryName}
        onNameChange={setName}
      />
    </FormDialog>
  )
}
