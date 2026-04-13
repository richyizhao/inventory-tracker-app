import { test as base, expect } from "@playwright/test";

const adminEmail = "admin@inventory.local";
const adminPassword = "Admin123!";

export const test = base.extend<{
  adminPage: void;
}>({
  adminPage: [
    async ({ page }, use) => {
      await page.goto("/");
      await login(page, adminEmail, adminPassword);
      await use();
    },
    { auto: true },
  ],
});

export { expect };

export async function login(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  await page.getByRole("button", { name: "Login" }).click();
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: /^Login$/ }).click();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
}

export async function logout(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Logout" }).click();
  await page.getByRole("button", { name: /^Logout$/ }).click();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
}
