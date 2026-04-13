import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SettingsActionCardProps = {
  actionLabel: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  isDisabled: boolean;
  isLoading: boolean;
  loadingLabel: string;
  onAction: () => void;
  variant?: "default" | "outline";
};

export function SettingsActionCard({
  actionLabel,
  description,
  detail,
  icon: Icon,
  isDisabled,
  isLoading,
  loadingLabel,
  onAction,
  variant = "default",
}: SettingsActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4" />
          {actionLabel}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          {detail}
        </div>
        <Button disabled={isDisabled} onClick={onAction} variant={variant}>
          <Icon className="size-4" />
          {isLoading ? loadingLabel : actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
