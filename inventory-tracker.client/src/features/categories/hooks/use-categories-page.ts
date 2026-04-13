import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  type Category,
  type SubCategory,
} from "@/features/categories/api/categories-api";
import { hasPermission, permissionIds } from "@/config/permissions";

export function useCategoriesPage() {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateSubCategoryOpen, setIsCreateSubCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const canViewCategories = hasPermission(
    user?.permissions,
    permissionIds.categoriesView,
  );
  const canManageCategories = hasPermission(
    user?.permissions,
    permissionIds.categoriesManage,
  );

  useEffect(() => {
    if (!token || !canViewCategories) {
      setIsLoading(false);
      return;
    }

    const authToken = token;
    let isActive = true;

    async function loadCategories() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCategories(authToken);

        if (isActive) {
          setCategories(response);
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load categories.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isActive = false;
    };
  }, [canViewCategories, token]);

  async function refreshCategories() {
    if (!token) {
      return;
    }

    setCategories(await getCategories(token));
  }

  function openCreateCategoryDialog() {
    setNewCategoryName("");
    setIsCreateCategoryOpen(true);
  }

  function openCreateSubCategoryDialog(categoryId?: string) {
    setSelectedCategoryId(categoryId ?? categories[0]?.id ?? "");
    setNewSubCategoryName("");
    setIsCreateSubCategoryOpen(true);
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setIsSaving(true);

    try {
      await createCategory(token, { name: newCategoryName });
      toast.success("Category created.");
      setIsCreateCategoryOpen(false);
      await refreshCategories();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create category.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateSubCategory(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!token) return;
    setIsSaving(true);

    try {
      await createSubCategory(token, {
        categoryId: selectedCategoryId,
        name: newSubCategoryName,
      });
      toast.success("Sub-category created.");
      setIsCreateSubCategoryOpen(false);
      await refreshCategories();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create sub-category.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDeleteCategory() {
    if (!token || !deletingCategory) return;
    setIsSaving(true);

    try {
      await deleteCategory(token, deletingCategory.id);
      toast.success("Category deleted.");
      setDeletingCategory(null);
      await refreshCategories();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete category.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDeleteSubCategory() {
    if (!token || !deletingSubCategory) return;
    setIsSaving(true);

    try {
      await deleteSubCategory(token, deletingSubCategory.id);
      toast.success("Sub-category deleted.");
      setDeletingSubCategory(null);
      await refreshCategories();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete sub-category.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
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
    refreshCategories,
    selectedCategoryId,
    setDeletingCategory,
    setDeletingSubCategory,
    setIsCreateCategoryOpen,
    setIsCreateSubCategoryOpen,
    setNewCategoryName,
    setNewSubCategoryName,
    setSelectedCategoryId,
  };
}
