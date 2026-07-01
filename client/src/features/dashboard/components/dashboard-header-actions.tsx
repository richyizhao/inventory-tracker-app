import { Button } from "@/components/ui/button"
import { dispatchDashboardRefresh } from "@/lib/refresh-events"
import { RefreshCwIcon } from "lucide-react"

export function DashboardHeaderActions() {
  return (
    <div className="ml-auto">
      <Button
        variant="outline"
        type="button"
        size="sm"
        onClick={dispatchDashboardRefresh}
      >
        <RefreshCwIcon />
        Refresh
      </Button>
    </div>
  )
}
