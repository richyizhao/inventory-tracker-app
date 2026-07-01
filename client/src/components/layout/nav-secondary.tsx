import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type DialogItemProps = {
  onOpenChange?: (open: boolean) => void
}

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url?: string
    dialog?: React.ReactElement<DialogItemProps>
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.dialog ? (
                <NavSecondaryDialogItem
                  item={{ ...item, dialog: item.dialog }}
                />
              ) : (
                <SidebarMenuButton
                  render={item.url ? <Link to={item.url} /> : undefined}
                  isActive={item.url ? pathname === item.url : false}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavSecondaryDialogItem({
  item,
}: {
  item: {
    title: string
    dialog: React.ReactElement<DialogItemProps>
    icon: React.ReactNode
  }
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <SidebarMenuButton type="button">
            {item.icon}
            <span>{item.title}</span>
          </SidebarMenuButton>
        }
      />
      {React.cloneElement(item.dialog, { onOpenChange: setOpen })}
    </Dialog>
  )
}
