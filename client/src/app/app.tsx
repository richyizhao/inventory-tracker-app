import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { Toaster } from "@/components/ui/sonner"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ThemeShortcut } from "@/components/theme-shortcut"
import { AuthProvider } from "@/features/auth/providers/auth-provider"

export function App({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ThemeShortcut />
      <AuthProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </div>
  )
}
