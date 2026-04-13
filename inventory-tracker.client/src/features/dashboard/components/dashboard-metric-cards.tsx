import type { LucideIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardMetricCard = {
  title: string;
  value: string;
  icon: LucideIcon;
};

type DashboardMetricCardsProps = {
  cards: DashboardMetricCard[];
};

export function DashboardMetricCards({ cards }: DashboardMetricCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="mt-4 text-6xl">{card.value}</CardTitle>
            </div>
            <div className="mr-2 rounded-2xl border bg-muted/50 p-2">
              <card.icon
                className="size-16 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
