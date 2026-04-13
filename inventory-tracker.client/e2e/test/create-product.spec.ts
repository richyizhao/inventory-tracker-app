import { expect, test } from "./fixtures";
import { clickRowAction, findTableRow, selectFirstOption } from "./helpers";

test("admin can manage the catalog and record stock from the product detail flow", async ({
  page,
}) => {
  const timestamp = Date.now();
  const productName = `Playwright Product ${timestamp}`;
  const sku = `PW-${timestamp}`;
  const stockNote = `Stocked in by Playwright ${timestamp}`;

  await page.goto("/products");
  await page.getByRole("button", { name: "Add product" }).click();

  await page.locator("#product-name").fill(productName);
  await page.locator("#product-sku").fill(sku);
  await page.locator("#product-unit-cost").fill("149.99");
  await page.locator("#product-selling-price").fill("229.99");
  await page.locator("#product-description").fill("Created by Playwright.");

  await selectFirstOption(page, page.locator("#product-category"));
  await selectFirstOption(page, page.locator("#product-subcategory"));

  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page.getByText("Product created.")).toBeVisible();

  const productRow = await findTableRow(page, productName);
  await expect(productRow).toContainText(sku);

  await clickRowAction(productRow, 0);

  const productSheet = page.getByRole("dialog");
  await expect(
    productSheet.getByRole("heading", { name: productName }),
  ).toBeVisible();

  await productSheet.getByRole("tab", { name: "Stock" }).click();
  await productSheet.locator("#stock-quantity").fill("4");
  await productSheet.locator("#stock-note").fill(stockNote);
  await productSheet.locator("#stock-unit-cost").fill("149.99");
  await productSheet.locator("#stock-expense-amount").fill("15");

  await productSheet.getByRole("button", { name: "Record movement" }).click();
  await expect(productSheet.locator("#stock-note")).toHaveValue("", {
    timeout: 10000,
  });

  await page.goto("/transactions");
  await page.getByPlaceholder("Search by product, user, or note").fill(stockNote);

  const transactionRow = await findTableRow(page, stockNote);
  await expect(transactionRow).toContainText(productName);
});
