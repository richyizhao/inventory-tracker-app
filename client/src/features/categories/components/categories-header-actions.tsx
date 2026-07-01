import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateCategoryDialog } from "@/features/categories/components/dialogs/create-category-dialog"
import { CreateSubCategoryDialog } from "@/features/categories/components/dialogs/create-sub-category-dialog"
import { PlusIcon } from "lucide-react"

export function CategoriesHeaderActions() {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = React.useState(false)
  const [isCreateSubCategoryOpen, setIsCreateSubCategoryOpen] = React.useState(false)

  return (
    <div className="ml-auto flex items-center gap-2">
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add category
        </DialogTrigger>
        <CreateCategoryDialog onOpenChange={setIsCreateCategoryOpen} />
      </Dialog>
      <Dialog
        open={isCreateSubCategoryOpen}
        onOpenChange={setIsCreateSubCategoryOpen}
      >
        <DialogTrigger
          render={<Button variant="outline" type="button" size="sm" />}
        >
          <PlusIcon />
          Add sub-category
        </DialogTrigger>
        <CreateSubCategoryDialog onOpenChange={setIsCreateSubCategoryOpen} />
      </Dialog>
    </div>
  )
}
