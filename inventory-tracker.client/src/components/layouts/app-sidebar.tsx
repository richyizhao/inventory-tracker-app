import * as React from "react";
import { Box } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  authenticatedAccountItems,
  menuSections,
  publicAccountItems,
} from "@/app/routes/route-config";
import {
  LoginDialog,
  LoginRequiredAlertDialog,
  LogoutAlertDialog,
  ProfileDialog,
} from "@/features/auth/components/account-dialogs";
import { hasPermission } from "@/lib/permissions";
import { useAuth } from "@/lib/auth/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = React.useState(false);
  const accountItems = isAuthenticated
    ? authenticatedAccountItems
    : publicAccountItems;
  const visibleMenuSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!isAuthenticated) {
          return !item.requiresAuth;
        }

        return (
          !item.requiredPermission ||
          hasPermission(user?.permissions, item.requiredPermission)
        );
      }),
    }))
    .filter((section) => section.items.length > 0);

  function openAccountAction(path: string) {
    if (path === "/login") {
      setIsLoginOpen(true);
      return;
    }

    if (path === "/profile") {
      setIsProfileOpen(true);
      return;
    }

    if (path === "/logout") {
      setIsLogoutOpen(true);
    }
  }

  function handleProtectedNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
  ) {
    if (isAuthenticated) {
      return;
    }

    event.preventDefault();
    setIsLoginRequiredOpen(true);
  }

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="px-6 py-4 group-data-[collapsible=icon]:px-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground group-data-[collapsible=icon]:size-6">
              <Box className="size-6 group-data-[collapsible=icon]:size-4" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-lg font-semibold text-sidebar-foreground">
                InvTra
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {visibleMenuSections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.path === location.pathname}
                        tooltip={item.title}
                        render={
                          <NavLink
                            onClick={
                              item.requiresAuth
                                ? handleProtectedNavigation
                                : undefined
                            }
                            to={item.path}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </NavLink>
                        }
                      ></SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="px-3 pb-4">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.path === location.pathname}
                      tooltip={item.title}
                      render={
                        item.component ? (
                          <NavLink to={item.path}>
                            <item.icon />
                            <span>{item.title}</span>
                          </NavLink>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openAccountAction(item.path)}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </button>
                        )
                      }
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <LogoutAlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
      <LoginRequiredAlertDialog
        onLoginClick={() => setIsLoginOpen(true)}
        onOpenChange={setIsLoginRequiredOpen}
        open={isLoginRequiredOpen}
      />
    </>
  );
}
