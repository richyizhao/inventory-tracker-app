import { ArrowRightLeft, Boxes, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DemoDataResult } from "@/features/settings/api/settings-api";

type SettingsLastRunCardProps = {
  lastResult: DemoDataResult | null;
};

type StatCardProps = {
  created: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  removed: number;
};

function StatCard({ created, icon: Icon, label, removed }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-3xl">
            +{created} / -{removed}
          </CardTitle>
        </div>
        <div className="mr-1 rounded-2xl border bg-muted/50 p-2">
          <Icon className="size-8 text-muted-foreground" />
        </div>
      </CardHeader>
    </Card>
  );
}

export function SettingsLastRunCard({
  lastResult,
}: SettingsLastRunCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-4" />
          Latest run
        </CardTitle>
        <CardDescription>
          A quick summary of the most recent demo-data action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lastResult ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                created={lastResult.usersCreated}
                icon={Users}
                label="Users"
                removed={lastResult.usersRemoved}
              />
              <StatCard
                created={lastResult.productsCreated}
                icon={Boxes}
                label="Products"
                removed={lastResult.productsRemoved}
              />
              <StatCard
                created={lastResult.transactionsCreated}
                icon={ArrowRightLeft}
                label="Transactions"
                removed={lastResult.transactionsRemoved}
              />
            </div>

            <div className="rounded-2xl border p-4 md:col-span-3">
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="mt-2 text-sm">{lastResult.message}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No demo-data action has been run in this session yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
