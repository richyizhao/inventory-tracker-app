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

export function ConfirmDialog({
  contentClassName = "sm:max-w-sm",
  description,
  isSubmitting,
  onSubmit,
  submitDisabled,
  submitLabel,
  submittingLabel,
  title,
}: {
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
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            type="submit"
            variant="destructive"
            disabled={submitDisabled ?? isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
