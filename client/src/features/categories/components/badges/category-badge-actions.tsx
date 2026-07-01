import { BadgeActionShell } from "@/features/categories/components/badges/badge-action-shell"
import { DeleteCategoryDialog } from "@/features/categories/components/dialogs/delete-category-dialog"
import { EditCategoryDialog } from "@/features/categories/components/dialogs/edit-category-dialog"
import type { Category } from "@/features/categories/types/categories"

export function CategoryBadgeActions({ category }: { category: Category }) {
  return (
    <BadgeActionShell
      badgeLabel={category.name}
      badgeVariant="outline"
      editDialog={(onOpenChange) => (
        <EditCategoryDialog category={category} onOpenChange={onOpenChange} />
      )}
      deleteDialog={(onOpenChange) => (
        <DeleteCategoryDialog category={category} onOpenChange={onOpenChange} />
      )}
    />
  )
}
