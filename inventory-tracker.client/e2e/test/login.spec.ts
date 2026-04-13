import { expect, test } from "@playwright/test";

import { login, logout } from "./fixtures";

test.use({ storageState: { cookies: [], origins: [] } });

test("dashboard data is gated by authentication", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Sign in to view dashboard data"),
  ).toBeVisible();
  await expect(page.getByText("Total Products")).not.toBeVisible();

  await login(page, "admin@inventory.local", "Admin123!");

  await expect(page.getByText("Total Products")).toBeVisible();
  await expect(page.getByText("Units in Stock")).toBeVisible();
  await expect(page.getByText("Low Stock")).toBeVisible();

  await logout(page);

  await expect(
    page.getByText("Sign in to view dashboard data"),
  ).toBeVisible();
});
