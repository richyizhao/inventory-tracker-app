import { Table } from "@/components/common/table"
import type { TableColumn } from "@/components/common/table"
import { CategoryBadgeActions } from "@/features/categories/components/badges/category-badge-actions"
import { SubCategoryBadgeActions } from "@/features/categories/components/badges/sub-category-badge-actions"
import type { Category } from "@/features/categories/types/categories"

export function CategoriesTableGrid({
  categories,
}: {
  categories: Category[]
}) {
  const columns: TableColumn<Category>[] = [
    {
      key: "category",
      header: "Category",
      cellClassName: "align-top",
      cell: (category) => (
        <div className="flex flex-wrap gap-2">
          <CategoryBadgeActions category={category} />
        </div>
      ),
    },
    {
      key: "subCategories",
      header: "Sub-categories",
      cellClassName: "align-top",
      cell: (category) =>
        category.subCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {category.subCategories.map((subCategory) => (
              <SubCategoryBadgeActions
                key={subCategory.id}
                categories={categories}
                category={category}
                subCategory={subCategory}
              />
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
  ]

  return (
    <Table
      data={categories}
      columns={columns}
      getRowKey={(category) => category.id}
      emptyMessage="No categories found."
    />
  )
}
