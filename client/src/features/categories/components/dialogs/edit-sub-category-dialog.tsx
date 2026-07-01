import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { SubCategoryFormFields } from "@/features/categories/components/forms/sub-category-form-fields"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { updateSubCategory } from "@/features/categories/api/update-sub-category"
import { dispatchCategoriesRefresh } from "@/lib/refresh-events"
import type {
  Category,
  CategorySubCategory,
} from "@/features/categories/types/categories"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function EditSubCategoryDialog({
  categories,
  category,
  onOpenChange,
  subCategory,
}: {
  categories: Category[]
  category: Category
  onOpenChange?: (open: boolean) => void
  subCategory: CategorySubCategory
}) {
  const { session } = useAuth()
  const [name, setName] = React.useState(subCategory.name)
  const [selectedCategoryName, setSelectedCategoryName] = React.useState(category.name)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setName(subCategory.name)
    setSelectedCategoryName(category.name)
    setError("")
  }, [category.name, subCategory])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to update a sub-category."
      setError(message)
      toast.error(message)
      return
    }

    const selectedCategory = categories.find(
      (categoryOption) => categoryOption.name === selectedCategoryName
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
      await updateSubCategory(
        {
          id: subCategory.id,
          categoryId: selectedCategory.id,
          name: name.trim(),
        },
        session.token
      )
      dispatchCategoriesRefresh()
      toast.success(`Updated sub-category ${name.trim()}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update sub-category right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-sm"
      description="Update the sub-category details below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit sub-category"
    >
      <SubCategoryFormFields
        categories={categories}
        categoryFieldId={`edit-sub-category-category-${subCategory.id}`}
        error={error}
        isCategoryDisabled={isSubmitting}
        isSubmitting={isSubmitting}
        name={name}
        nameId={`edit-sub-category-name-${subCategory.id}`}
        selectedCategoryName={selectedCategoryName}
        onCategoryChange={setSelectedCategoryName}
        onNameChange={setName}
      />
    </FormDialog>
  )
}
