import { Plus, Search } from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ProductDeleteDialog } from "@/features/products/components/product-delete-dialog";
import { ProductDetailSheet } from "@/features/products/components/product-detail-sheet";
import { ProductFormDialog } from "@/features/products/components/product-form-dialog";
import { ProductsTable } from "@/features/products/components/products-table";
import { useProductsPage } from "@/features/products/hooks/use-products-page";

export function ProductsPage() {
  const {
    canCreateTransactions,
    canDeleteProducts,
    canManageProducts,
    canViewProducts,
    categories,
    categoryFilter,
    confirmDelete,
    deleteTarget,
    dialogMode,
    error,
    form,
    isDetailLoading,
    isLoading,
    isSaving,
    isStockSaving,
    openCreate,
    openEdit,
    page,
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
    setStockExpenseAmount,
    setStockNote,
    setStockQuantity,
    setStockReason,
    setStockType,
    setStockUnitCost,
    sort,
    stockExpenseAmount,
    stockNote,
    stockQuantity,
    stockReason,
    stockType,
    stockUnitCost,
    submitProduct,
    submitStock,
    totalPages,
  } = useProductsPage();

  const availableSubCategories =
    categories.find((category) => category.id === form.categoryId)
      ?.subCategories ?? [];
  const selectedCategoryLabel =
    categoryFilter === "all"
      ? "All categories"
      : (categories.find((category) => category.id === categoryFilter)?.name ??
        "All categories");
  const selectedSortLabel =
    sort === "quantity:asc"
      ? "Stock Low-High"
      : sort === "name:asc"
        ? "Name A-Z"
        : sort === "sku:asc"
          ? "SKU A-Z"
          : sort === "created_at:desc"
            ? "Recently added"
            : sort === "updated_at:desc"
              ? "Recently updated"
              : "Stock Low-High";

  usePageHeaderActions(
    canManageProducts ? (
      <Button onClick={openCreate}>
        <Plus className="size-4" />
        Add product
      </Button>
    ) : null,
    [canManageProducts, openCreate],
  );

  if (!canViewProducts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            This page is only available to roles with product access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="mb-1 text-2xl font-semibold max-md:text-center">
          Catalog
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Browse and manage products in your catalog.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-9 pl-9"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or SKU"
                value={query}
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(String(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-56">
                <span>{selectedCategoryLabel}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(String(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-56">
                <span>{selectedSortLabel}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quantity:asc">Stock Low-High</SelectItem>
                <SelectItem value="name:asc">Name A-Z</SelectItem>
                <SelectItem value="sku:asc">SKU A-Z</SelectItem>
                <SelectItem value="created_at:desc">Recently added</SelectItem>
                <SelectItem value="updated_at:desc">Recently updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : (
            <>
              <ProductsTable
                canDeleteProducts={canDeleteProducts}
                canManageProducts={canManageProducts}
                onDelete={setDeleteTarget}
                onEdit={openEdit}
                onSelect={setSelectedProduct}
                products={products}
              />

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        availableSubCategories={availableSubCategories}
        categories={categories}
        dialogMode={dialogMode}
        form={form}
        isSaving={isSaving}
        onDialogOpenChange={(open) => !open && setDialogMode(null)}
        onFormChange={setForm}
        onProductImageFileChange={setProductImageFile}
        onSubmit={submitProduct}
        productImagePreviewUrl={productImagePreviewUrl}
      />

      <ProductDeleteDialog
        isSaving={isSaving}
        onConfirm={confirmDelete}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        target={deleteTarget}
      />

      <ProductDetailSheet
        canCreateTransactions={canCreateTransactions}
        isDetailLoading={isDetailLoading}
        isStockSaving={isStockSaving}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onStockExpenseAmountChange={setStockExpenseAmount}
        onStockNoteChange={setStockNote}
        onStockQuantityChange={setStockQuantity}
        onStockReasonChange={setStockReason}
        onStockTypeChange={setStockType}
        onStockUnitCostChange={setStockUnitCost}
        onSubmitStock={submitStock}
        open={Boolean(selectedProduct)}
        productTransactions={productTransactions}
        selectedProduct={selectedProduct}
        stockExpenseAmount={stockExpenseAmount}
        stockNote={stockNote}
        stockQuantity={stockQuantity}
        stockReason={stockReason}
        stockType={stockType}
        stockUnitCost={stockUnitCost}
      />
    </div>
  );
}
