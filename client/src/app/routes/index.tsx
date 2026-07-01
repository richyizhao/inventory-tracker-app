import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/custom/list-shell"
import { ChartBarVertical } from "@/features/dashboard/components/charts/chart-bar-vertical"
import { SectionCards } from "@/features/dashboard/components/cards/section-cards"
import { LowStockProductsPanel } from "@/features/dashboard/components/panels/low-stock-products-panel"
import { RecentTransactionsCard } from "@/features/dashboard/components/panels/recent-transactions-card"
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview"

export const Route = createFileRoute("/")({ component: DashboardRoute })

function DashboardRoute() {
  const { loadState } = useDashboardOverview()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading dashboard..."
        errorTitle="Unable to load dashboard"
      />
    )
  }

  const { data } = loadState

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards summary={data} />
          <div className="grid gap-6 px-4 lg:px-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
            <ChartBarVertical data={data.inventoryMovements} />
            <LowStockProductsPanel products={data.lowStockProducts} />
          </div>
          <div className="px-4 lg:px-6">
            <RecentTransactionsCard transactions={data.recentTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
