import * as React from "react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PencilIcon, Trash2Icon } from "lucide-react"

export function BadgeActionShell({
  badgeLabel,
  badgeVariant,
  children,
  deleteDialog,
  editDialog,
}: {
  badgeLabel: string
  badgeVariant: "outline" | "secondary"
  children?: ReactNode
  deleteDialog: (onOpenChange: (open: boolean) => void) => ReactNode
  editDialog: (onOpenChange: (open: boolean) => void) => ReactNode
}) {
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  return (
    <Badge
      variant={badgeVariant}
      className="h-auto gap-1 rounded-full px-2 py-1 text-foreground"
    >
      <span className="pr-1">{badgeLabel}</span>
      {children}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5 rounded-full"
            />
          }
      >
          <PencilIcon />
          <span className="sr-only">Edit {badgeLabel}</span>
        </DialogTrigger>
        {editDialog(setIsEditOpen)}
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5 rounded-full text-destructive hover:text-destructive"
            />
          }
        >
          <Trash2Icon />
          <span className="sr-only">Delete {badgeLabel}</span>
        </DialogTrigger>
        {deleteDialog(setIsDeleteOpen)}
      </Dialog>
    </Badge>
  )
}
