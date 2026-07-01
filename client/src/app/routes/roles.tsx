import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/common/list-shell"
import { RolesTableGrid } from "@/features/roles/components/roles-table-grid"
import { useRolesTable } from "@/features/roles/hooks/use-roles-table"

export const Route = createFileRoute("/roles")({
  component: RouteComponent,
})

function RouteComponent() {
  const { loadState } = useRolesTable()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading roles..."
        errorTitle="Unable to load roles"
      />
    )
  }

  return (
    <ListShell
      loading={false}
      loadingText="Loading roles..."
      errorTitle="Unable to load roles"
    >
      <RolesTableGrid roles={loadState.roles} />
    </ListShell>
  )
}
