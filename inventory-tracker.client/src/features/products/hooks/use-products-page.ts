import { useDeferredValue, useEffect, useState } from "react";
import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import {
  type Category,
  type Product,
} from "@/features/products/api/products-api";
import {
  createProductMutationOptions,
  createProductTransactionMutationOptions,
  deleteProductMutationOptions,
  updateProductMutationOptions,
  uploadProductImageMutationOptions,
} from "@/features/products/api/product-mutations";
import {
  getCategoriesQueryOptions,
  getProductQueryOptions,
  getProductTransactionsQueryOptions,
  getProductsQueryOptions,
  productKeys,
} from "@/features/products/api/product-queries";
import type { ProductForm } from "@/features/products/types";
import { hasPermission, permissionIds } from "@/config/permissions";

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  description: "",
  imageUrl: "",
  categoryId: "",
  subCategoryId: "",
  unitCost: "0",
  sellingPrice: "0",
};
const pageSize = 10;

export function useProductsPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState("created_at:desc");
  const [page, setPage] = useState(1);

  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedProductPreview, setSelectedProductPreview] =
    useState<Product | null>(null);

  const [stockType, setStockType] = useState<"In" | "Out" | "Adjustment">("In");
  const [stockQuantity, setStockQuantity] = useState("1");
  const [stockNote, setStockNote] = useState("");
  const [stockReason, setStockReason] = useState("Restock");
  const [stockUnitCost, setStockUnitCost] = useState("");
  const [stockExpenseAmount, setStockExpenseAmount] = useState("0");

  const canViewProducts = hasPermission(
    user?.permissions,
    permissionIds.productsView,
  );
  const canManageProducts = hasPermission(
    user?.permissions,
    permissionIds.productsManage,
  );
  const canDeleteProducts = hasPermission(
    user?.permissions,
    permissionIds.productsDelete,
  );
  const canCreateTransactions = hasPermission(
    user?.permissions,
    permissionIds.transactionsCreate,
  );

  const productListInput = {
    page,
    limit: pageSize,
    q: deferredQuery.trim() || undefined,
    categoryId: categoryFilter === "all" ? undefined : categoryFilter,
    sort,
  };

  const categoriesQuery = useQuery({
    ...(token
      ? getCategoriesQueryOptions(token)
      : {
          queryKey: productKeys.categories(),
          queryFn: async (): Promise<Category[]> => [],
        }),
    enabled: Boolean(token && canViewProducts),
  });

  const productsQuery = useQuery({
    ...(token
      ? getProductsQueryOptions(token, productListInput)
      : {
          queryKey: productKeys.list(productListInput),
          queryFn: async () => ({
            items: [],
            limit: pageSize,
            page,
            total: 0,
          }),
        }),
    enabled: Boolean(token && canViewProducts),
  });

  const productDetailQuery = useQuery({
    ...(token && selectedProductId
      ? getProductQueryOptions(token, selectedProductId)
      : {
          queryKey: productKeys.detail(selectedProductId ?? "none"),
          queryFn: async () => selectedProductPreview as Product,
        }),
    enabled: Boolean(token && canViewProducts && selectedProductId),
  });

  const productTransactionsQuery = useQuery({
    ...(token && selectedProductId
      ? getProductTransactionsQueryOptions(token, selectedProductId)
      : {
          queryKey: productKeys.transactions(selectedProductId ?? "none"),
          queryFn: async () => [],
        }),
    enabled: Boolean(token && canViewProducts && selectedProductId),
  });

  const uploadProductImageMutation = useMutation(
    token
      ? uploadProductImageMutationOptions(token)
      : {
          mutationFn: async () => ({
            imageUrl: "",
          }),
        },
  );
  const createProductMutation = useMutation(
    token
      ? createProductMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to create a product.");
          },
        },
  );
  const updateProductMutation = useMutation(
    token
      ? updateProductMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to update a product.");
          },
        },
  );
  const deleteProductMutation = useMutation(
    token
      ? deleteProductMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to delete a product.");
          },
        },
  );
  const createTransactionMutation = useMutation(
    token
      ? createProductTransactionMutationOptions(token)
      : {
          mutationFn: async () => {
            throw new Error("You must be logged in to record stock movement.");
          },
        },
  );

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const products = useMemo(
    () => productsQuery.data?.items ?? [],
    [productsQuery.data],
  );
  const totalPages = Math.max(
    1,
    Math.ceil((productsQuery.data?.total ?? 0) / pageSize),
  );
  const selectedProduct = productDetailQuery.data ?? selectedProductPreview;
  const productTransactions = productTransactionsQuery.data ?? [];
  const error =
    (categoriesQuery.error instanceof Error && categoriesQuery.error.message) ||
    (productsQuery.error instanceof Error && productsQuery.error.message) ||
    null;
  const isLoading = categoriesQuery.isLoading || productsQuery.isLoading;
  const isDetailLoading =
    productDetailQuery.isLoading || productTransactionsQuery.isLoading;
  const isSaving =
    uploadProductImageMutation.isPending ||
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteProductMutation.isPending;
  const isStockSaving = createTransactionMutation.isPending;
  const productImagePreviewUrl = useMemo(
    () => (productImageFile ? URL.createObjectURL(productImageFile) : null),
    [productImageFile],
  );
  const resolvedForm = useMemo(() => {
    const firstCategory = categories[0];
    const firstSubCategory = firstCategory?.subCategories[0];

    return {
      ...form,
      categoryId: form.categoryId || firstCategory?.id || "",
      subCategoryId: form.subCategoryId || firstSubCategory?.id || "",
    };
  }, [categories, form]);

  useEffect(() => {
    if (!productImagePreviewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(productImagePreviewUrl);
    };
  }, [productImagePreviewUrl]);

  useEffect(() => {
    if (productDetailQuery.error instanceof Error) {
      toast.error(productDetailQuery.error.message);
    }
  }, [productDetailQuery.error]);

  useEffect(() => {
    if (productTransactionsQuery.error instanceof Error) {
      toast.error(productTransactionsQuery.error.message);
    }
  }, [productTransactionsQuery.error]);

  function setSelectedProduct(product: Product | null) {
    setSelectedProductId(product?.id ?? null);
    setSelectedProductPreview(product);
  }

  async function refreshProducts() {
    await queryClient.invalidateQueries({
      queryKey: productKeys.lists(),
    });
  }

  function openCreate() {
    const firstCategory = categories[0];
    const firstSubCategory = firstCategory?.subCategories[0];
    setDialogMode("create");
    setEditingProductId(null);
    setProductImageFile(null);
    setForm({
      ...emptyForm,
      categoryId: firstCategory?.id || "",
      subCategoryId: firstSubCategory?.id || "",
    });
  }

  function openEdit(product: Product) {
    setDialogMode("edit");
    setEditingProductId(product.id);
    setProductImageFile(null);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      imageUrl: product.imageUrl,
      categoryId: product.category.id,
      subCategoryId: product.subCategory.id,
      unitCost: String(product.unitCost),
      sellingPrice: String(product.sellingPrice),
    });
  }

  async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !dialogMode) return;

    try {
      const imageUrl = productImageFile
        ? (await uploadProductImageMutation.mutateAsync(productImageFile)).imageUrl
        : resolvedForm.imageUrl;

      if (dialogMode === "create") {
        await createProductMutation.mutateAsync({
          name: resolvedForm.name,
          sku: resolvedForm.sku,
          description: resolvedForm.description,
          imageUrl,
          subCategoryId: resolvedForm.subCategoryId,
          unitCost: Number(resolvedForm.unitCost || 0),
          sellingPrice: Number(resolvedForm.sellingPrice || 0),
        });
        toast.success("Product created.");
      } else if (editingProductId) {
        const updatedProduct = await updateProductMutation.mutateAsync({
          productId: editingProductId,
          name: resolvedForm.name,
          sku: resolvedForm.sku,
          description: resolvedForm.description,
          imageUrl,
          subCategoryId: resolvedForm.subCategoryId,
          unitCost: Number(resolvedForm.unitCost || 0),
          sellingPrice: Number(resolvedForm.sellingPrice || 0),
        });
        queryClient.setQueryData(
          productKeys.detail(editingProductId),
          updatedProduct,
        );
        toast.success("Product updated.");
        if (selectedProductId === editingProductId) {
          setSelectedProductPreview(updatedProduct);
        }
      }

      setDialogMode(null);
      setProductImageFile(null);
      await refreshProducts();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save product.",
      );
    }
  }

  async function confirmDelete() {
    if (!token || !deleteTarget) return;

    try {
      await deleteProductMutation.mutateAsync({
        productId: deleteTarget.id,
      });
      toast.success("Product deleted.");
      if (selectedProductId === deleteTarget.id) {
        setSelectedProduct(null);
      }
      setDeleteTarget(null);
      await refreshProducts();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product.",
      );
    }
  }

  async function submitStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !selectedProduct) return;

    try {
      await createTransactionMutation.mutateAsync({
        productId: selectedProduct.id,
        type: stockType,
        quantity: Number(stockQuantity),
        reason: stockReason,
        note: stockNote,
        unitCost:
          stockType === "In"
            ? Number(stockUnitCost || selectedProduct.unitCost || 0)
            : undefined,
        expenseAmount:
          stockType === "In" ? Number(stockExpenseAmount || 0) : 0,
      });
      toast.success("Stock movement recorded.");
      setStockQuantity("1");
      setStockNote("");
      setStockReason("Restock");
      setStockUnitCost("");
      setStockExpenseAmount("0");
      await queryClient.invalidateQueries({
        queryKey: productKeys.detail(selectedProduct.id),
      });
      await queryClient.invalidateQueries({
        queryKey: productKeys.transactions(selectedProduct.id),
      });
      await refreshProducts();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to record stock movement.",
      );
    }
  }

  return {
    canCreateTransactions,
    canDeleteProducts,
    canManageProducts,
    canViewProducts,
    categories,
    categoryFilter,
    confirmDelete,
    deleteTarget,
    dialogMode,
    editingProductId,
    error,
    form: resolvedForm,
    isDetailLoading,
    isLoading,
    isSaving,
    isStockSaving,
    openCreate,
    openEdit,
    page,
    productImageFile,
    productImagePreviewUrl,
    productTransactions,
    products,
    query,
    selectedProduct,
    setCategoryFilter,
    setDeleteTarget,
    setDialogMode,
    setForm,
    setPage,
    setProductImageFile,
    setQuery,
    setSelectedProduct,
    setSort,
    setStockNote,
    setStockQuantity,
    setStockReason,
    setStockUnitCost,
    setStockExpenseAmount,
    setStockType,
    sort,
    stockNote,
    stockQuantity,
    stockReason,
    stockUnitCost,
    stockExpenseAmount,
    stockType,
    submitProduct,
    submitStock,
    totalPages,
  };
}
