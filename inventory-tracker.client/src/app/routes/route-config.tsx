import type { ComponentType } from "react";
import {
  BarChart3,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageSearch,
  Settings,
  ScrollText,
  Tags,
  UserCircle,
  UserKey,
  Users,
} from "lucide-react";

import { permissionIds } from "@/config/permissions";
import type { AppRouteItem, AppRouteSection } from "@/types/routing";
import { CategoriesPage } from "@/features/categories/page";
import { AnalyticsPage } from "@/features/analytics/page";
import { DashboardPage } from "@/features/dashboard/page";
import { ProductsPage } from "@/features/products/page";
import { RolesPage } from "@/features/roles/page";
import { TransactionsPage } from "@/features/transactions/page";
import { UsersPage } from "@/features/users/page";
import { SettingsPage } from "@/features/settings/page";

export const menuSections: AppRouteSection[] = [
  {
    label: "Operations",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        component: DashboardPage,
        requiredPermission: permissionIds.dashboardView,
      },
      {
        title: "Analytics",
        path: "/analytics",
        icon: BarChart3,
        component: AnalyticsPage,
        requiresAuth: true,
        requiredPermission: permissionIds.analyticsView,
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        title: "Categories",
        path: "/categories",
        icon: Tags,
        component: CategoriesPage,
        requiresAuth: true,
        requiredPermission: permissionIds.categoriesView,
      },
      {
        title: "Products",
        path: "/products",
        icon: PackageSearch,
        component: ProductsPage,
        requiresAuth: true,
        requiredPermission: permissionIds.productsView,
      },
      {
        title: "Transactions",
        path: "/transactions",
        icon: ScrollText,
        component: TransactionsPage,
        requiresAuth: true,
        requiredPermission: permissionIds.transactionsView,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        path: "/users",
        icon: Users,
        component: UsersPage,
        requiresAuth: true,
        requiredPermission: permissionIds.usersView,
      },
      {
        title: "Roles",
        path: "/roles",
        icon: UserKey,
        component: RolesPage,
        requiresAuth: true,
        requiredPermission: permissionIds.rolesView,
      },
    ],
  },
];

export const authenticatedAccountItems: AppRouteItem[] = [
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    component: SettingsPage,
    requiresAuth: true,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
  {
    title: "Logout",
    path: "/logout",
    icon: LogOut,
  },
];

export const publicAccountItems: AppRouteItem[] = [
  {
    title: "Login",
    path: "/login",
    icon: LogIn,
  },
];

export const routedSidebarItems = [
  ...menuSections.flatMap((section) => section.items),
  ...authenticatedAccountItems,
].filter((item): item is AppRouteItem & { component: ComponentType } =>
  Boolean(item.component),
);

export function findSidebarItemByPathname(pathname: string) {
  return routedSidebarItems.find((item) => item.path === pathname);
}
