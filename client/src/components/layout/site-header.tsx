import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AnalyticsHeaderActions } from "@/features/analytics/components/analytics-header-actions"
import { CategoriesHeaderActions } from "@/features/categories/components/categories-header-actions"
import { DashboardHeaderActions } from "@/features/dashboard/components/dashboard-header-actions"
import { ProductsHeaderActions } from "@/features/products/components/products-header-actions"
import { RolesHeaderActions } from "@/features/roles/components/roles-header-actions"
import { TransactionsHeaderActions } from "@/features/transactions/components/transactions-header-actions"
import { UsersHeaderActions } from "@/features/users/components/users-header-actions"
import { useRouterState } from "@tanstack/react-router"
import type { ComponentType } from "react"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/categories": "Categories",
  "/products": "Products",
  "/transactions": "Transactions",
  "/users": "Users",
  "/roles": "Roles",
  "/settings": "Settings",
}

const pageHeaderActions: Record<string, ComponentType | undefined> = {
  "/": DashboardHeaderActions,
  "/analytics": AnalyticsHeaderActions,
  "/categories": CategoriesHeaderActions,
  "/products": ProductsHeaderActions,
  "/transactions": TransactionsHeaderActions,
  "/users": UsersHeaderActions,
  "/roles": RolesHeaderActions,
}

export function SiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const fallbackTitle =
    pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ") || "Dashboard"

  const pageTitle = pageTitles[pathname] ?? fallbackTitle
  const HeaderActions = pageHeaderActions[pathname]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        {HeaderActions ? <HeaderActions /> : null}
      </div>
    </header>
  )
}
