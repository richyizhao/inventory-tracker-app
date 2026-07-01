import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/features/auth/hooks/use-login"
import { ApiError } from "@/lib/api"
import { toast } from "sonner"

export function LoginDialog({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void
}) {
  const { login, isLoginPending } = useLogin()
  const [username, setUsername] = React.useState("admin")
  const [password, setPassword] = React.useState("Admin123!")
  const [error, setError] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    try {
      await login({ username, password })
      toast.success(`Signed in as ${username}`)
      onOpenChange?.(false)
    } catch (submitError) {
      const message = submitError instanceof ApiError
        ? submitError.message
        : "Unable to sign in right now."

      setError(message)
      toast.error(message)
    }
  }

  return (
    <DialogContent className="sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your username and password to sign in to the inventory app.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="username-1">Username</Label>
            <Input
              id="username-1"
              name="username"
              placeholder="admin"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isLoginPending}
            />
          </Field>
          <Field>
            <Label htmlFor="password-1">Password</Label>
            <Input
              id="password-1"
              name="password"
              type="password"
              placeholder="Admin123!"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoginPending}
            />
          </Field>
          <FieldError>{error}</FieldError>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" disabled={isLoginPending}>
            {isLoginPending ? "Signing in..." : "Login"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
