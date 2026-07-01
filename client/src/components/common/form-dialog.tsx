import type { FormEventHandler, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function FormDialog({
  children,
  contentClassName,
  description,
  isSubmitting,
  onSubmit,
  submitDisabled,
  submitLabel,
  submittingLabel,
  title,
}: {
  children: ReactNode
  contentClassName?: string
  description: ReactNode
  isSubmitting: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  submitDisabled?: boolean
  submitLabel: string
  submittingLabel: string
  title: ReactNode
}) {
  return (
    <DialogContent className={contentClassName}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" disabled={submitDisabled ?? isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
