import type * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import {
  LoginDialog,
  LoginRequiredAlertDialog,
  LogoutAlertDialog,
  ProfileDialog,
} from "@/features/auth/components/account-dialogs";
import { useAuth } from "@/lib/auth/auth-provider";

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("@/lib/auth/auth-provider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogClose: ({
    children,
    render,
  }: {
    children?: React.ReactNode;
    render?: React.ReactNode;
  }) => <>{render ?? children}</>,
}));

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    open,
    children,
  }: {
    open: boolean;
    children: React.ReactNode;
  }) => (open ? <div>{children}</div> : null),
  AlertDialogAction: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  AlertDialogCancel: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

const mockedUseAuth = vi.mocked(useAuth);

const authUser = {
  id: "user-1",
  name: "Admin User",
  email: "admin@inventory.local",
  createdAt: "2026-01-01T00:00:00Z",
  roles: ["Admin"],
  permissions: ["pages.dashboard.view"],
};

describe("account-dialogs", () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: authUser,
      token: "token-123",
      isAuthenticated: true,
      isReady: true,
      login: authMocks.login,
      logout: authMocks.logout,
      updateProfile: authMocks.updateProfile,
    });
  });

  it("submits login credentials and closes on success", async () => {
    authMocks.login.mockResolvedValueOnce(undefined);
    const onOpenChange = vi.fn();

    const { container } = render(
      <LoginDialog open={true} onOpenChange={onOpenChange} />,
    );

    fireEvent.change(container.querySelector("#login-email")!, {
      target: { value: "admin@inventory.local" },
    });
    fireEvent.change(container.querySelector("#login-password")!, {
      target: { value: "Admin123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(authMocks.login).toHaveBeenCalledWith(
        "admin@inventory.local",
        "Admin123!",
      ),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows a login error when authentication fails", async () => {
    authMocks.login.mockRejectedValueOnce(new Error("Invalid credentials"));

    const { container } = render(
      <LoginDialog open={true} onOpenChange={vi.fn()} />,
    );

    fireEvent.change(container.querySelector("#login-email")!, {
      target: { value: "admin@inventory.local" },
    });
    fireEvent.change(container.querySelector("#login-password")!, {
      target: { value: "Wrong123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument(),
    );
  });

  it("blocks invalid profile password updates", async () => {
    const { container } = render(
      <ProfileDialog open={true} onOpenChange={vi.fn()} />,
    );

    const inputs = container.querySelectorAll("input");

    fireEvent.change(inputs[2]!, {
      target: { value: "short" },
    });
    fireEvent.change(inputs[3]!, {
      target: { value: "Current123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument(),
    );
    expect(authMocks.updateProfile).not.toHaveBeenCalled();
  });

  it("submits normalized profile changes and closes on success", async () => {
    authMocks.updateProfile.mockResolvedValueOnce(undefined);
    const onOpenChange = vi.fn();

    const { container } = render(
      <ProfileDialog open={true} onOpenChange={onOpenChange} />,
    );

    const inputs = container.querySelectorAll("input");

    fireEvent.change(inputs[0]!, {
      target: { value: "Updated Admin" },
    });
    fireEvent.change(inputs[1]!, {
      target: { value: "updated@inventory.local" },
    });
    fireEvent.change(inputs[3]!, {
      target: { value: "Current123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(authMocks.updateProfile).toHaveBeenCalledWith({
        name: "Updated Admin",
        email: "updated@inventory.local",
        currentPassword: "Current123!",
        newPassword: undefined,
      }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("logs out from the confirmation dialog", () => {
    const onOpenChange = vi.fn();

    render(<LogoutAlertDialog open={true} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(authMocks.logout).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("redirects users to login from the required-login dialog", () => {
    const onOpenChange = vi.fn();
    const onLoginClick = vi.fn();

    render(
      <LoginRequiredAlertDialog
        open={true}
        onOpenChange={onOpenChange}
        onLoginClick={onLoginClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onLoginClick).toHaveBeenCalled();
  });
});
