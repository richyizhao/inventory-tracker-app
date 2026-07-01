import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePersonalProfile } from "@/features/users/hooks/use-personal-profile"

export function PersonalProfile() {
  const {
    error,
    isAdminUser,
    isLoading,
    isSubmitting,
    profile,
    setError,
    setField,
    submitProfileUpdate,
    values,
  } = usePersonalProfile()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    await submitProfileUpdate()
  }

  return (
    <DialogContent className="sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {isAdminUser
              ? "Cannot change admin profile."
              : "Make changes to your profile here."}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="profile-display-name">Display name</Label>
            <Input
              id="profile-display-name"
              value={values.displayName}
              onChange={(event) => setField("displayName", event.target.value)}
              disabled={isLoading || isSubmitting || isAdminUser}
            />
          </Field>
          <Field>
            <Label htmlFor="profile-username">Username</Label>
            <Input
              id="profile-username"
              value={values.username}
              onChange={(event) => setField("username", event.target.value)}
              disabled={isLoading || isSubmitting || isAdminUser}
            />
          </Field>
          <Field>
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              disabled={isLoading || isSubmitting || isAdminUser}
            />
          </Field>
          <Field>
            <Label htmlFor="profile-password">Password</Label>
            <Input
              id="profile-password"
              type="password"
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              disabled={isLoading || isSubmitting || isAdminUser}
            />
          </Field>
        </FieldGroup>
        {error ? (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            type="submit"
            disabled={isLoading || isSubmitting || isAdminUser || profile === null}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
