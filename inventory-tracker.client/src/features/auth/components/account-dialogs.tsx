import { useEffect, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth/auth-provider";
import { passwordSchema } from "@/lib/validation/password";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

function FieldMessage({
  message,
  tone = "default",
}: {
  message: string | null;
  tone?: "default" | "destructive";
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={
        tone === "destructive"
          ? "text-sm text-destructive"
          : "text-sm text-muted-foreground"
      }
    >
      {message}
    </p>
  );
}

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Enter your email and password to access the inventory workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              autoComplete="email"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              type="email"
              value={email}
            />
          </div>

          <div>
            <FieldLabel>Password</FieldLabel>
            <Input
              autoComplete="current-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </div>

          <FieldMessage message={error} tone="destructive" />

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { updateProfile, user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setNewPassword("");
    setCurrentPassword("");
    setError(null);
    setIsSubmitting(false);
  }, [open, user]);

  if (!user) {
    return null;
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const normalizedNewPassword = newPassword.trim() ? newPassword : undefined;

    if (normalizedNewPassword) {
      const passwordResult = passwordSchema.safeParse(normalizedNewPassword);

      if (!passwordResult.success) {
        setError(
          passwordResult.error.issues[0]?.message ?? "Invalid password.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await updateProfile({
        name,
        email,
        currentPassword,
        newPassword: normalizedNewPassword,
      });

      toast.success("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update your profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Update your account details. Your current password is required
            before changes are saved.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p>Role: {user.roles.join(", ")}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>Name</FieldLabel>
            <Input
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </div>

          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </div>

          <div>
            <FieldLabel>New password</FieldLabel>
            <Input
              autoComplete="new-password"
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              type="password"
              value={newPassword}
            />
          </div>

          <div>
            <FieldLabel>Current password</FieldLabel>
            <Input
              autoComplete="current-password"
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Required to save changes"
              type="password"
              value={currentPassword}
            />
          </div>

          <FieldMessage message={error} tone="destructive" />

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function LogoutAlertDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { logout } = useAuth();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            You'll be signed out of the current session and returned to the Home
            page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              logout();
              onOpenChange(false);
            }}
            variant="destructive"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LoginRequiredAlertDialog({
  open,
  onOpenChange,
  onLoginClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to log in before you can use this feature.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onLoginClick();
            }}
          >
            Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
