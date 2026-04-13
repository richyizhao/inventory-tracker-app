import { Plus } from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoriesTable } from "@/features/categories/components/categories-table";
import {
  CreateCategoryDialog,
  CreateSubCategoryDialog,
  DeleteCategoryDialog,
  DeleteSubCategoryDialog,
} from "@/features/categories/components/category-dialogs";
import { useCategoriesPage } from "@/features/categories/hooks/use-categories-page";

export function CategoriesPage() {
  const {
    canManageCategories,
    canViewCategories,
    categories,
    confirmDeleteCategory,
    confirmDeleteSubCategory,
    deletingCategory,
    deletingSubCategory,
    error,
    handleCreateCategory,
    handleCreateSubCategory,
    isCreateCategoryOpen,
    isCreateSubCategoryOpen,
    isLoading,
    isSaving,
    newCategoryName,
    newSubCategoryName,
    openCreateCategoryDialog,
    openCreateSubCategoryDialog,
    selectedCategoryId,
    setDeletingCategory,
    setDeletingSubCategory,
    setIsCreateCategoryOpen,
    setIsCreateSubCategoryOpen,
    setNewCategoryName,
    setNewSubCategoryName,
    setSelectedCategoryId,
  } = useCategoriesPage();

  usePageHeaderActions(
    canManageCategories ? (
      <div className="flex gap-2">
        <Button onClick={openCreateCategoryDialog} variant="outline">
          <Plus className="size-4" />
          Add category
        </Button>
        <Button onClick={() => openCreateSubCategoryDialog()}>
          <Plus className="size-4" />
          Add sub-category
        </Button>
      </div>
    ) : null,
    [
      canManageCategories,
      openCreateCategoryDialog,
      openCreateSubCategoryDialog,
    ],
  );

  if (!canViewCategories) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            This page is only available to roles with category access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1 max-md:text-center">
          Collections
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Browse product categories and subcategories.
        </p>
      </div>

      <Card>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading categories...
            </p>
          ) : categories.length ? (
            <CategoriesTable
              canManageCategories={canManageCategories}
              categories={categories}
              onDeleteCategory={setDeletingCategory}
              onDeleteSubCategory={setDeletingSubCategory}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories exist yet.
            </p>
          )}
        </CardContent>
      </Card>

      <CreateCategoryDialog
        isOpen={isCreateCategoryOpen}
        isSaving={isSaving}
        name={newCategoryName}
        onNameChange={setNewCategoryName}
        onOpenChange={setIsCreateCategoryOpen}
        onSubmit={handleCreateCategory}
      />

      <CreateSubCategoryDialog
        categories={categories}
        isOpen={isCreateSubCategoryOpen}
        isSaving={isSaving}
        name={newSubCategoryName}
        onNameChange={setNewSubCategoryName}
        onOpenChange={setIsCreateSubCategoryOpen}
        onSelectedCategoryChange={setSelectedCategoryId}
        onSubmit={handleCreateSubCategory}
        selectedCategoryId={selectedCategoryId}
      />

      <DeleteCategoryDialog
        isSaving={isSaving}
        onConfirm={confirmDeleteCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        target={deletingCategory}
      />

      <DeleteSubCategoryDialog
        isSaving={isSaving}
        onConfirm={confirmDeleteSubCategory}
        onOpenChange={(open) => !open && setDeletingSubCategory(null)}
        target={deletingSubCategory}
      />
    </div>
  );
}
