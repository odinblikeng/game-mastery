import { test, expect } from "@playwright/test";

const visitAndWait = async (page: any, path: string) => {
  await page.goto(path);
  await expect(page.locator('[data-testid="cy-app-shell"]')).toHaveAttribute("data-hydrated", "true");
};

test.describe("Tools sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await visitAndWait(page, "/?tools=menu");
  });

  test("shows the tool menu", async ({ page }) => {
    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-tool-item-initiative"]')).toContainText("Initiative");
    await expect(page.getByText("Session Active")).toBeVisible();
  });

  test("opens the initiative tool and returns to the menu", async ({ page }) => {
    await page.locator('[data-testid="cy-tool-item-initiative"]').click();
    await expect(page).toHaveURL(/.*tools=initiative.*/);
    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeVisible();

    await page.locator('[data-testid="cy-tools-back-button"]').click();
    await expect(page).toHaveURL(/.*tools=menu.*/);
    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
  });

  test("falls back to the menu for an unknown tool slug", async ({ page }) => {
    await visitAndWait(page, "/?tools=nonexistent");

    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-tool-item-initiative"]')).toBeVisible();
  });

  test("collapses the tools menu and updates the URL when the collapse button is clicked", async ({ page }) => {
    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
    await page.locator('[data-testid="cy-tools-collapse-button"]').click();

    await expect(page.locator('[data-testid="cy-tools-menu"]')).not.toBeVisible();
    await expect(page).not.toHaveURL(/.*tools.*/);
  });

  test("collapses the active tool and updates the URL when the collapse button is clicked", async ({ page }) => {
    await page.locator('[data-testid="cy-tool-item-initiative"]').click();
    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeVisible();
    await page.locator('[data-testid="cy-tools-collapse-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).not.toBeVisible();
    await expect(page).not.toHaveURL(/.*tools.*/);
  });
});
