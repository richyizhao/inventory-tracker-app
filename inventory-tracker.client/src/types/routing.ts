import type { ComponentType } from "react";

export type AppRouteItem = {
  title: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  component?: ComponentType;
  requiresAuth?: boolean;
  requiredPermission?: string;
};

export type AppRouteSection = {
  label: string;
  items: AppRouteItem[];
};
