import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateProductDialog } from "@/features/products/components/dialogs/create-product-dialog"
import { PlusIcon } from "lucide-react"

export function ProductsHeaderActions() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  return (
    <div className="ml-auto">
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add product
        </DialogTrigger>
        <CreateProductDialog onOpenChange={setIsCreateOpen} />
      </Dialog>
    </div>
  )
}
