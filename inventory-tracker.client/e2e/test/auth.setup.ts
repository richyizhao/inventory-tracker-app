import { expect, test } from "@playwright/test";

import { login } from "./fixtures";

test("seed demo data for browser flows", async ({ page }) => {
  await page.goto("/");
  await login(page, "admin@inventory.local", "Admin123!");
  await page.getByRole("link", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Generate demo data" }).click();
  await expect(page.getByText("Latest run")).toBeVisible();
  await expect(
    page.locator("p", { hasText: "Fresh demo data was generated" }).first(),
  ).toBeVisible({
    timeout: 60_000,
  });
});
