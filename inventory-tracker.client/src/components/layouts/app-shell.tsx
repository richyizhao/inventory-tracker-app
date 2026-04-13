import { Outlet, useLocation } from "react-router-dom";

import {
  PageHeaderActionsProvider,
  usePageHeaderActionsContext,
} from "@/app/providers/page-header-actions";
import { findSidebarItemByPathname } from "@/app/routes/route-config";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function AppShellLayout() {
  const location = useLocation();
  const activeItem = findSidebarItemByPathname(location.pathname);
  const { actions } = usePageHeaderActionsContext();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-0 flex-1 flex-col bg-background">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">
              {activeItem?.title ?? "Dashboard"}
            </h1>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-4 md:p-8">
            <section className="min-h-full bg-background">
              <Outlet />
            </section>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppShell() {
  return (
    <PageHeaderActionsProvider>
      <AppShellLayout />
    </PageHeaderActionsProvider>
  );
}
