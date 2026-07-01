import { createFileRoute } from "@tanstack/react-router"

import { ListShell } from "@/components/custom/list-shell"
import { ChartArea } from "@/features/analytics/components/charts/chart-area"
import { ChartBarHorizontal } from "@/features/analytics/components/charts/chart-bar-horizontal"
import { ChartPieDonut } from "@/features/analytics/components/charts/chart-pie-donut"
import { useAnalyticsOverview } from "@/features/analytics/hooks/use-analytics-overview"

export const Route = createFileRoute('/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  const { loadState, range } = useAnalyticsOverview()

  if (loadState.status !== "success") {
    return (
      <ListShell
        loading={loadState.status === "loading"}
        error={loadState.status === "error" ? loadState.message : null}
        loadingText="Loading analytics..."
        errorTitle="Unable to load analytics"
      />
    )
  }

  const { data } = loadState

  return (
    <ListShell
      loading={false}
      loadingText="Loading analytics..."
      errorTitle="Unable to load analytics"
    >
      <div className="@container/main flex flex-1 flex-col gap-2 -m-4 lg:-m-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid gap-6 px-4 lg:px-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <ChartBarHorizontal
              profitData={data.profitByCategory}
              spendingData={data.restockExpenseByCategory}
              title="Spending vs Profit by Category"
              descriptionText={`Category spending and profit for ${range.toLowerCase()}`}
            />
            <ChartPieDonut data={data.inventoryValueDistribution} />
          </div>
          <div className="px-4 lg:px-6">
            <ChartArea
              data={data.profitSpendingOverTime}
              descriptionText={`Showing spending and profit for ${range.toLowerCase()}`}
            />
          </div>
        </div>
      </div>
    </ListShell>
  )
}
