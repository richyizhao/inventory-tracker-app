import * as React from "react"

import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "@/components/layout/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ChartLineIcon, TagsIcon, PackageSearchIcon, ScrollTextIcon, UsersRoundIcon, UserRoundKeyIcon, SettingsIcon, CircleUserRoundIcon, LogInIcon, LogOutIcon, PackageOpenIcon } from "lucide-react"

import { LoginDialog } from "@/features/auth/components/dialogs/login-dialog"
import { LogoutDialog } from "@/features/auth/components/dialogs/logout-dialog"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { PersonalProfile } from "@/features/users/components/personal-profile"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthReady, isAuthenticated } = useAuth()

  const data = React.useMemo(() => ({
    overview: [
      {
        name: "Dashboard",
        url: "/",
        icon: (
          <LayoutDashboardIcon />
        ),
      },
      {
        name: "Analytics",
        url: "/analytics",
        icon: (
          <ChartLineIcon />
        ),
      },
    ],
    inventory: [
      {
        name: "Categories",
        url: "/categories",
        icon: (
          <TagsIcon />
        ),
      },
      {
        name: "Products",
        url: "/products",
        icon: (
          <PackageSearchIcon />
        ),
      },
      {
        name: "Transactions",
        url: "/transactions",
        icon: (
          <ScrollTextIcon />
        ),
      },
    ],
    management: [
      {
        name: "Users",
        url: "/users",
        icon: (
          <UsersRoundIcon />
        ),
      },
      {
        name: "Roles",
        url: "/roles",
        icon: (
          <UserRoundKeyIcon />
        ),
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: (
          <SettingsIcon />
        ),
      },
      ...(isAuthReady && isAuthenticated
        ? [
            {
              title: "Profile",
              dialog: (
                <PersonalProfile />
              ),
              icon: (
                <CircleUserRoundIcon />
              ),
            },
            {
              title: "Logout",
              dialog: (
                <LogoutDialog />
              ),
              icon: (
                <LogOutIcon />
              ),
            },
          ]
        : isAuthReady
          ? [
            {
              title: "Login",
              dialog: (
                <LoginDialog />
              ),
              icon: (
                <LogInIcon />
              ),
            },
          ]
          : []),
    ],
  }), [isAuthReady, isAuthenticated])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/" />}
            >
              <PackageOpenIcon className="size-5!" />
              <span className="text-base font-semibold">InvTra Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Overview" items={data.overview} />
        <NavMain title="Inventory" items={data.inventory} />
        <NavMain title="Management" items={data.management} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
