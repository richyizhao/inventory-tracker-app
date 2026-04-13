import {
  AlertTriangle,
  Boxes,
  Lock,
  Package,
  RefreshCw,
} from "lucide-react";

import { usePageHeaderActions } from "@/app/providers/page-header-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardMetricCards } from "@/features/dashboard/components/dashboard-metric-cards";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary";
import { useAuth } from "@/lib/auth/auth-provider";
import { formatCompactNumber } from "@/utils/format";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { error, isLoading, refreshSummary, summary } = useDashboardSummary();

  usePageHeaderActions(
    isAuthenticated ? (
      <Button onClick={refreshSummary} variant="outline">
        <RefreshCw className="size-4" />
        Refresh
      </Button>
    ) : null,
    [isAuthenticated, refreshSummary],
  );

  const cards = [
    {
      title: "Total Products",
      value: formatCompactNumber(summary.totalProducts),
      icon: Package,
    },
    {
      title: "Units in Stock",
      value: formatCompactNumber(summary.totalStock),
      icon: Boxes,
    },
    {
      title: "Low Stock",
      value: String(summary.lowStockCount),
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1 max-md:text-center">
          Inventory
        </h2>
        <p className="text-sm text-muted-foreground max-md:text-center">
          Overview of inventory and recent transactions.
        </p>
      </div>

      {!isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-4" />
              Sign in to view dashboard data
            </CardTitle>
            <CardDescription>
              Dashboard metrics and recent inventory activity are hidden until
              you log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You can stay on this page as the default landing screen, but no
            operational stats are shown for logged-out users.
          </CardContent>
        </Card>
      ) : null}

      {!isAuthenticated ? null : (
        <>
          {error ? (
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle>Dashboard unavailable</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          <DashboardMetricCards cards={cards} />
          <RecentActivityCard
            isLoading={isLoading}
            transactions={summary.recentTransactions}
          />
        </>
      )}
    </div>
  );
}
