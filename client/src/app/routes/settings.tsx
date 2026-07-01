import { createFileRoute } from "@tanstack/react-router"

import { SettingsPage } from "@/features/settings/components/settings-page"

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsPage />
}
