import { BadgeActionShell } from "@/features/categories/components/badges/badge-action-shell"
import { DeleteSubCategoryDialog } from "@/features/categories/components/dialogs/delete-sub-category-dialog"
import { EditSubCategoryDialog } from "@/features/categories/components/dialogs/edit-sub-category-dialog"
import type {
  Category,
  CategorySubCategory,
} from "@/features/categories/types/categories"

export function SubCategoryBadgeActions({
  categories,
  category,
  subCategory,
}: {
  categories: Category[]
  category: Category
  subCategory: CategorySubCategory
}) {
  return (
    <BadgeActionShell
      badgeLabel={subCategory.name}
      badgeVariant="secondary"
      editDialog={(onOpenChange) => (
        <EditSubCategoryDialog
          categories={categories}
          category={category}
          onOpenChange={onOpenChange}
          subCategory={subCategory}
        />
      )}
      deleteDialog={(onOpenChange) => (
        <DeleteSubCategoryDialog
          onOpenChange={onOpenChange}
          subCategory={subCategory}
        />
      )}
    />
  )
}
