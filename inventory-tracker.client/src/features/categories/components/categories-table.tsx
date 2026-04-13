import { Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  Category,
  SubCategory,
} from "@/features/categories/api/categories-api";

type CategoriesTableProps = {
  canManageCategories: boolean;
  categories: Category[];
  onDeleteCategory: (category: Category) => void;
  onDeleteSubCategory: (subCategory: SubCategory) => void;
};

export function CategoriesTable({
  canManageCategories,
  categories,
  onDeleteCategory,
  onDeleteSubCategory,
}: CategoriesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Sub-categories</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                <span>{category.name}</span>
                {canManageCategories ? (
                  <button
                    className="text-muted-foreground transition hover:text-foreground"
                    onClick={() => onDeleteCategory(category)}
                    type="button"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                {category.subCategories.map((subCategory) => (
                  <span
                    key={subCategory.id}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                  >
                    {subCategory.name}
                    {canManageCategories ? (
                      <button
                        className="text-muted-foreground transition hover:text-foreground"
                        onClick={() => onDeleteSubCategory(subCategory)}
                        type="button"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    ) : null}
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
