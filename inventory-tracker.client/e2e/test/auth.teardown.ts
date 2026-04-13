import { expect, test } from "@playwright/test";

import { login } from "./fixtures";

test("reset demo data after browser flows", async ({ page }) => {
  await page.goto("/");
  await login(page, "admin@inventory.local", "Admin123!");
  await page.getByRole("link", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  const latestRunCard = page.getByText("Latest run").locator("..").locator("..");

  await expect(latestRunCard).toContainText("Existing demo data was removed.", {
    timeout: 60_000,
  });
});
