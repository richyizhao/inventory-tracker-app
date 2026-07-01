import * as React from "react"

import { ConfirmDialog } from "@/components/custom/confirm-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { deleteProduct } from "@/features/products/api/delete-product"
import { dispatchProductsRefresh } from "@/lib/refresh-events"
import type { Product } from "@/features/products/types/products"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function DeleteProductDialog({
  onOpenChange,
  product,
}: {
  onOpenChange?: (open: boolean) => void
  product: Product
}) {
  const { session } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.token) {
      const message = "You need to be signed in to delete a product."
      toast.error(message)
      return
    }

    setIsSubmitting(true)

    try {
      await deleteProduct(product.id, session.token)
      dispatchProductsRefresh()
      toast.success(`Deleted product ${product.name}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to delete product right now."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConfirmDialog
      description={<>Are you sure you want to delete {product.name}?</>}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      submitLabel="Delete product"
      submittingLabel="Deleting..."
      title="Delete product"
    />
  )
}
