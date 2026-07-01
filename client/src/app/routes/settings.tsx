import { createFileRoute } from "@tanstack/react-router"

import { SettingsSeedCard } from "@/features/settings/components/settings-seed-card"

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1">
      <SettingsSeedCard />
    </div>
  )
}
