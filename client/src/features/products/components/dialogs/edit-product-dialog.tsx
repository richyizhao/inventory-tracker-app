import * as React from "react"

import { FormDialog } from "@/components/custom/form-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { ProductFormFields } from "@/features/products/components/forms/product-form-fields"
import { uploadProductImage } from "@/features/products/api/upload-product-image"
import { updateProduct } from "@/features/products/api/update-product"
import { useProductCategories } from "@/features/products/hooks/use-product-categories"
import { useProductForm } from "@/features/products/hooks/use-product-form"
import {
  createProductFormValuesFromProduct,
  findSelectedCategory,
  findSelectedSubCategory,
} from "@/features/products/lib/product-form"
import { dispatchProductsRefresh } from "@/lib/refresh-events"
import type { Product } from "@/features/products/types/products"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function EditProductDialog({
  onOpenChange,
  product,
}: {
  onOpenChange?: (open: boolean) => void
  product: Product
}) {
  const { session } = useAuth()
  const initialValues = React.useMemo(
    () => createProductFormValuesFromProduct(product),
    [product]
  )
  const { categories, categoriesError, isLoadingCategories } = useProductCategories()
  const { setField, values } = useProductForm(initialValues)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    setError("")
  }, [product])

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
      const message = "You need to be signed in to update a product."
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
      await updateProduct(
        {
          id: product.id,
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
      toast.success(`Updated product ${values.name.trim()}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to update product right now."

      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormDialog
      contentClassName="sm:max-w-2xl"
      description="Update the product details below."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitting || isLoadingCategories || isUploadingImage}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit product"
    >
      <ProductFormFields
        categories={categories}
        error={error}
        idPrefix={`edit-product-${product.id}`}
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
