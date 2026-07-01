import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { toast } from "sonner"

export function LogoutDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { logout, session } = useLogout()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    logout()
    toast.success(`Signed out${session ? ` from ${session.username}` : ""}`)
    onOpenChange?.(false)
  }

  return (
    <DialogContent className="sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" variant="destructive">
            Logout
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
