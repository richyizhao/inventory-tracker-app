import { expect, type Locator, type Page } from "@playwright/test";

export async function findTableRow(page: Page, text: string) {
  const row = page.locator("tbody tr").filter({ hasText: text }).first();
  await expect(row).toBeVisible();
  return row;
}

export async function clickRowAction(row: Locator, index: number) {
  await row.getByRole("button").nth(index).click();
}

export async function selectFirstOption(page: Page, trigger: Locator) {
  await trigger.click();
  await page.getByRole("option").first().click();
}
