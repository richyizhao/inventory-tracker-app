import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/common/list-shell"
import { ProductsTableToolbar } from "@/features/products/components/products-table-toolbar"
import { ProductsTableGrid } from "@/features/products/components/products-table-grid"
import { ProductsTablePagination } from "@/features/products/components/products-table-pagination"
import { useProductsTable } from "@/features/products/hooks/use-products-table"

export const Route = createFileRoute("/products")({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    categories,
    loadState,
    pageSize,
    search,
    selectedCategoryName,
    selectedSubCategoryKey,
    selectedSort,
    setPage,
    setPageSize,
    setSearch,
    setSelectedCategoryName,
    setSelectedSubCategoryKey,
    setSelectedSort,
  } = useProductsTable()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading products..."
        errorTitle="Unable to load products"
      />
    )
  }

  const totalPages = Math.max(
    1,
    Math.ceil(loadState.totalItems / loadState.pageSize)
  )

  return (
    <ListShell
      loading={false}
      loadingText="Loading products..."
      errorTitle="Unable to load products"
      toolbar={
        <ProductsTableToolbar
          categories={categories}
          search={search}
          selectedCategoryName={selectedCategoryName}
          selectedSubCategoryKey={selectedSubCategoryKey}
          selectedSort={selectedSort}
          setSearch={setSearch}
          setSelectedCategoryName={setSelectedCategoryName}
          setSelectedSubCategoryKey={setSelectedSubCategoryKey}
          setSelectedSort={setSelectedSort}
        />
      }
      footer={
        <ProductsTablePagination
          hasNextPage={loadState.hasNextPage}
          hasPreviousPage={loadState.hasPreviousPage}
          page={loadState.page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      }
    >
      <ProductsTableGrid products={loadState.products} />
    </ListShell>
  )
}
