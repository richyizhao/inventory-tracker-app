import { login, getCurrentUser, updateProfile } from "@/lib/auth/auth-api";
import { request } from "@/lib/http";

vi.mock("@/lib/http", () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

describe("auth-api", () => {
  it("posts credentials when logging in", async () => {
    requestMock.mockResolvedValueOnce({} as never);

    await login("admin@inventory.local", "Admin123!");

    expect(requestMock).toHaveBeenCalledWith("/Auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@inventory.local",
        password: "Admin123!",
      }),
    });
  });

  it("requests the current user with the bearer token", async () => {
    requestMock.mockResolvedValueOnce({} as never);

    await getCurrentUser("token-123");

    expect(requestMock).toHaveBeenCalledWith("/Users/me", { token: "token-123" });
  });

  it("normalizes blank new passwords when updating the profile", async () => {
    requestMock.mockResolvedValueOnce({} as never);

    await updateProfile("token-123", {
      name: "Admin",
      email: "admin@inventory.local",
      currentPassword: "Current123!",
    });

    expect(requestMock).toHaveBeenCalledWith("/Users/me/profile", {
      method: "PUT",
      token: "token-123",
      body: JSON.stringify({
        name: "Admin",
        email: "admin@inventory.local",
        currentPassword: "Current123!",
        newPassword: "",
      }),
    });
  });
});
