import { expect, test } from "./fixtures";
import { login, logout } from "./fixtures";
import { clickRowAction, findTableRow } from "./helpers";

test("admins can manage scoped roles and users for access control", async ({
  page,
}) => {
  const timestamp = Date.now();
  const roleName = `Playwright Operator ${timestamp}`;
  const userName = `Playwright User ${timestamp}`;
  const userEmail = `playwright-${timestamp}@inventory.local`;
  const userPassword = "Playwright123!";

  await page.goto("/roles");
  await page.getByRole("button", { name: "Create role" }).click();

  const createRoleDialog = page.getByRole("dialog");
  await createRoleDialog.locator("#role-name").fill(roleName);
  await createRoleDialog.getByRole("button", { name: "Create role" }).click();

  await expect(page.getByText("Role created.")).toBeVisible();

  const roleRow = await findTableRow(page, roleName);
  await clickRowAction(roleRow, 0);

  const permissionsDialog = page.getByRole("dialog");
  await permissionsDialog.getByText("Dashboard", { exact: true }).click();
  await permissionsDialog.getByText("Products", { exact: true }).click();
  await permissionsDialog.getByText("Transactions", { exact: true }).click();
  await permissionsDialog.getByText("Record transactions", { exact: true }).click();
  await permissionsDialog.getByRole("button", { name: "Save permissions" }).click();

  await expect(page.getByText("Role permissions updated.")).toBeVisible();

  await page.goto("/users");
  await page.getByRole("button", { name: "Create user" }).click();

  const createUserDialog = page.getByRole("dialog");
  await createUserDialog.locator("#user-name").fill(userName);
  await createUserDialog.locator("#user-email").fill(userEmail);
  await createUserDialog.locator("#user-password").fill(userPassword);
  await createUserDialog.getByRole("combobox").click();
  await page.getByRole("option", { name: roleName }).click();
  await createUserDialog.getByRole("button", { name: "Create user" }).click();

  await expect(page.getByText("User created.")).toBeVisible();

  const userRow = await findTableRow(page, userName);
  await expect(userRow).toContainText(roleName);

  await logout(page);
  await login(page, userEmail, userPassword);

  await expect(page.getByText("Total Products")).toBeVisible();

  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add product" })).not.toBeVisible();

  await page.goto("/transactions");
  await page.getByRole("button", { name: "Record movement" }).click();
  await expect(page.getByRole("button", { name: "Record transaction" })).toBeVisible();
  await page.getByRole("button", { name: "History" }).click();
  await expect(
    page.getByText(
      "Your role can record movements, but ledger history is limited to managers and admins.",
    ),
  ).toBeVisible();

  await page.goto("/roles");
  await expect(
    page.getByText(
      "This page is only available to roles with role visibility access.",
    ),
  ).toBeVisible();
});
