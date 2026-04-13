import { expect, test } from "./fixtures";
import { selectFirstOption } from "./helpers";

test("admin can record a stock transaction from the transactions page", async ({
  page,
}) => {
  const timestamp = Date.now();
  const productName = `Playwright Tx Product ${timestamp}`;
  const sku = `PW-TX-${timestamp}`;
  const note = `Recorded by Playwright ${Date.now()}`;

  await page.goto("/products");
  await page.getByRole("button", { name: "Add product" }).click();
  await page.locator("#product-name").fill(productName);
  await page.locator("#product-sku").fill(sku);
  await page.locator("#product-unit-cost").fill("55");
  await page.locator("#product-selling-price").fill("85");
  await page.locator("#product-description").fill(
    "Created for transaction page e2e coverage.",
  );
  await selectFirstOption(page, page.locator("#product-category"));
  await selectFirstOption(page, page.locator("#product-subcategory"));
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page.getByText("Product created.")).toBeVisible();

  await page.goto("/transactions");
  await page.getByRole("button", { name: "Record movement" }).click();

  await expect(page.locator("#record-transaction-product")).not.toContainText(
    "Select a product",
  );
  await page.locator("#record-transaction-product").click();
  await page.getByRole("option", { name: new RegExp(`${productName} \\(${sku}\\)`) }).click();
  await page.locator("#record-transaction-quantity").fill("3");
  await page.locator("#record-transaction-unit-cost").fill("55");
  await page.locator("#record-transaction-expense-amount").fill("10");
  await page.locator("#record-transaction-note").fill(note);
  await page.locator("#record-transaction-note").blur();

  const createTransactionResponsePromise = page.waitForResponse((response) => {
    const url = response.url().toLowerCase();
    return (
      response.request().method() === "POST" &&
      (url.endsWith("/transactions") || url.includes("/transactions?"))
    );
  });

  await expect(
    page.getByRole("button", { name: "Record transaction" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Record transaction" }).click();

  const createTransactionResponse = await createTransactionResponsePromise;
  if (!createTransactionResponse.ok()) {
    throw new Error(
      `Transaction request failed with ${createTransactionResponse.status()}: ${await createTransactionResponse.text()}`,
    );
  }
  await page.getByRole("button", { name: "History" }).click();
  await page.getByPlaceholder("Search by product, user, or note").fill(note);

  const transactionRow = page.locator("tbody tr").filter({ hasText: note }).first();
  await expect(transactionRow).toBeVisible({ timeout: 10000 });
  await expect(transactionRow).toContainText("Restock");
  await expect(transactionRow).toContainText("3");
});
