import { act, render, screen, waitFor } from "@testing-library/react";

import { ApiError } from "@/lib/http";
import { AuthProvider, useAuth } from "@/lib/auth/auth-provider";
import {
  getCurrentUser,
  login as loginRequest,
  updateProfile as updateProfileRequest,
} from "@/lib/auth/auth-api";
import type { AuthResponse, AuthUser } from "@/lib/auth/types";

vi.mock("@/lib/auth/auth-api", () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  updateProfile: vi.fn(),
}));

const getCurrentUserMock = vi.mocked(getCurrentUser);
const loginRequestMock = vi.mocked(loginRequest);
const updateProfileRequestMock = vi.mocked(updateProfileRequest);

const authStorageKey = "inventory-tracker.auth";

const authUser: AuthUser = {
  id: "user-1",
  name: "Admin User",
  email: "admin@inventory.local",
  createdAt: "2026-01-01T00:00:00Z",
  roles: ["Admin"],
  permissions: ["pages.dashboard.view"],
};

const authResponse: AuthResponse = {
  token: "token-123",
  expiresAtUtc: "2026-01-02T00:00:00Z",
  user: authUser,
};

function AuthHarness() {
  const auth = useAuth();

  return (
    <div>
      <span data-testid="ready">{String(auth.isReady)}</span>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="name">{auth.user?.name ?? "none"}</span>
      <button
        onClick={() => void auth.login("admin@inventory.local", "Admin123!")}
      >
        do-login
      </button>
      <button onClick={() => auth.logout()}>do-logout</button>
      <button
        onClick={() =>
          void auth.updateProfile({
            name: "Updated Admin",
            email: "updated@inventory.local",
            currentPassword: "Current123!",
          })
        }
      >
        do-update
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("removes invalid stored auth payloads", () => {
    window.localStorage.setItem(authStorageKey, "{bad json");

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    expect(window.localStorage.getItem(authStorageKey)).toBeNull();
    expect(screen.getByTestId("ready")).toHaveTextContent("true");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("refreshes the stored user on mount", async () => {
    window.localStorage.setItem(
      authStorageKey,
      JSON.stringify({
        token: authResponse.token,
        expiresAtUtc: authResponse.expiresAtUtc,
        user: { ...authUser, name: "Stale User" },
      }),
    );
    getCurrentUserMock.mockResolvedValueOnce(authUser);

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("ready")).toHaveTextContent("true"),
    );

    expect(getCurrentUserMock).toHaveBeenCalledWith("token-123");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("name")).toHaveTextContent("Admin User");
  });

  it("clears stored auth when refreshing the user returns an ApiError", async () => {
    window.localStorage.setItem(authStorageKey, JSON.stringify(authResponse));
    getCurrentUserMock.mockRejectedValueOnce(new ApiError("Unauthorized", 401));

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("ready")).toHaveTextContent("true"),
    );

    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(window.localStorage.getItem(authStorageKey)).toBeNull();
  });

  it("stores auth after login and clears it on logout", async () => {
    loginRequestMock.mockResolvedValueOnce(authResponse);

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText("do-login").click();
    });

    expect(loginRequestMock).toHaveBeenCalledWith(
      "admin@inventory.local",
      "Admin123!",
    );
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(window.localStorage.getItem(authStorageKey)).toContain("token-123");

    await act(async () => {
      screen.getByText("do-logout").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("authenticated")).toHaveTextContent("false"),
    );
    expect(window.localStorage.getItem(authStorageKey)).toBeNull();
  });

  it("throws when updating the profile without a token", async () => {
    let capturedError: unknown;

    function ErrorHarness() {
      const auth = useAuth();

      return (
        <button
          onClick={async () => {
            try {
              await auth.updateProfile({
                name: "Updated Admin",
                email: "updated@inventory.local",
                currentPassword: "Current123!",
              });
            } catch (error) {
              capturedError = error;
            }
          }}
        >
          trigger-error
        </button>
      );
    }

    render(
      <AuthProvider>
        <ErrorHarness />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText("trigger-error").click();
    });

    expect(capturedError).toBeInstanceOf(ApiError);
    expect(updateProfileRequestMock).not.toHaveBeenCalled();
  });

  it("stores the refreshed auth payload after updating the profile", async () => {
    window.localStorage.setItem(authStorageKey, JSON.stringify(authResponse));
    getCurrentUserMock.mockResolvedValueOnce(authUser);
    updateProfileRequestMock.mockResolvedValueOnce({
      ...authResponse,
      token: "token-456",
      user: { ...authUser, name: "Updated Admin" },
    });

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("ready")).toHaveTextContent("true"),
    );

    await act(async () => {
      screen.getByText("do-update").click();
    });

    expect(updateProfileRequestMock).toHaveBeenCalledWith("token-123", {
      name: "Updated Admin",
      email: "updated@inventory.local",
      currentPassword: "Current123!",
    });
    expect(screen.getByTestId("name")).toHaveTextContent("Updated Admin");
    expect(window.localStorage.getItem(authStorageKey)).toContain("token-456");
  });
});
