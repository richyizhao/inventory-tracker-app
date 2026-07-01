import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/common/list-shell"
import { CategoriesTableGrid } from "@/features/categories/components/categories-table-grid"
import { useCategoriesTable } from "@/features/categories/hooks/use-categories-table"

export const Route = createFileRoute("/categories")({
  component: RouteComponent,
})

function RouteComponent() {
  const { loadState } = useCategoriesTable()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading categories..."
        errorTitle="Unable to load categories"
      />
    )
  }

  return (
    <ListShell
      loading={false}
      loadingText="Loading categories..."
      errorTitle="Unable to load categories"
    >
      <CategoriesTableGrid categories={loadState.categories} />
    </ListShell>
  )
}
