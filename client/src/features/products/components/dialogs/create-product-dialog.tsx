import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { createProduct } from "@/features/products/api/create-product"
import { uploadProductImage } from "@/features/products/api/upload-product-image"
import { ProductFormFields } from "@/features/products/components/forms/product-form-fields"
import { useProductCategories } from "@/features/products/hooks/use-product-categories"
import { useProductForm } from "@/features/products/hooks/use-product-form"
import {
  createEmptyProductFormValues,
  findSelectedCategory,
  findSelectedSubCategory,
} from "@/features/products/lib/product-form"
import { dispatchProductsRefresh } from "@/lib/refresh-events"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

const initialValues = createEmptyProductFormValues()

export function CreateProductDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { session } = useAuth()
  const { categories, categoriesError, isLoadingCategories } = useProductCategories()
  const { setField, setValues, values } = useProductForm(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (categoriesError) {
      setError(categoriesError)
    }
  }, [categoriesError])

  async function handleImageFileChange(file: File | null) {
    if (!file) {
      return
    }

    if (!session?.token) {
      const message = "You need to be signed in to upload a product image."
      setError(message)
      toast.error(message)
      return
    }

    setError("")
    setIsUploadingImage(true)

    try {
      const response = await uploadProductImage(file, session.token)
      setField("imageUrl", response.imageUrl)
      toast.success("Uploaded product image")
    } catch (uploadError) {
      const message =
        uploadError instanceof ApiError
          ? uploadError.message
          : "Unable to upload product image right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!session?.token) {
      const message = "You need to be signed in to create a product."
      setError(message)
      toast.error(message)
      return
    }

    const selectedCategory = findSelectedCategory({
      categories,
      selectedCategoryName: values.selectedCategoryName,
    })

    if (!selectedCategory) {
      setError("Please select a category.")
      return
    }

    const selectedSubCategory = findSelectedSubCategory({
      category: selectedCategory,
      selectedSubCategoryName: values.selectedSubCategoryName,
    })

    setIsSubmitting(true)

    try {
      await createProduct(
        {
          name: values.name.trim(),
          sku: values.sku.trim(),
          categoryId: selectedCategory.id,
          subCategoryId: selectedSubCategory?.id,
          totalUnitStock: Number(values.totalUnitStock),
          lowStockThreshold: Number(values.lowStockThreshold),
          buyPrice: Number(values.buyPrice),
          sellPrice: Number(values.sellPrice),
          imageUrl: values.imageUrl.trim() || undefined,
        },
        session.token
      )

      dispatchProductsRefresh()
      toast.success(`Created product ${values.name.trim()}`)
      onOpenChange?.(false)
      setValues(initialValues)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create product right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-2xl"
      description="Fill out the details below to create a new product."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingCategories || isUploadingImage}
      submitLabel="Add product"
      submittingLabel="Creating..."
      title="Add product"
    >
      <ProductFormFields
        categories={categories}
        error={error}
        idPrefix="create-product"
        isLoadingCategories={isLoadingCategories}
        isUploadingImage={isUploadingImage}
        isSubmitting={isSubmitting}
        onFieldChange={setField}
        onImageFileChange={handleImageFileChange}
        values={values}
      />
    </FormDialog>
  )
}
