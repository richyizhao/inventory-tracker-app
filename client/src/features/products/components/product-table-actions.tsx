import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DeleteProductDialog } from "@/features/products/components/dialogs/delete-product-dialog"
import { EditProductDialog } from "@/features/products/components/dialogs/edit-product-dialog"
import type { Product } from "@/features/products/types/products"
import { PencilIcon, Trash2Icon } from "lucide-react"

export function ProductTableActions({ product }: { product: Product }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  return (
    <div className="flex w-full items-center gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="flex-1"
            />
          }
        >
          <PencilIcon />
          Edit
        </DialogTrigger>
        <EditProductDialog product={product} onOpenChange={setIsEditOpen} />
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger
          render={
            <Button
              variant="destructive"
              type="button"
              size="sm"
              className="flex-1"
            />
          }
        >
          <Trash2Icon />
          Delete
        </DialogTrigger>
        <DeleteProductDialog product={product} onOpenChange={setIsDeleteOpen} />
      </Dialog>
    </div>
  )
}
