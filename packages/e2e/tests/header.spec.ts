import { test, expect } from "@playwright/test";

const visitAndWait = async (page: any, path: string) => {
  await page.goto(path);
  await expect(page.locator('[data-testid="cy-app-shell"]')).toHaveAttribute("data-hydrated", "true");
};

test.describe("Left rail navigation", () => {
  test("renders the rail shell on the dashboard", async ({ page }) => {
    await visitAndWait(page, "/");

    await expect(page.locator('[data-testid="cy-rail-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-rail-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-rail-areas"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-rail-tools"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-rail-theme-toggle"]')).toBeAttached();
  });

  test("clears the query state when Dashboard is clicked", async ({ page }) => {
    await visitAndWait(page, "/?sidebar=areas&area=m1&tools=menu");

    await page.locator('[data-testid="cy-rail-dashboard"]').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Open the area compendium or session tools from the rail to get started.")).toBeVisible();
  });

  test("clicking the Areas button adds sidebar to URL", async ({ page }) => {
    await visitAndWait(page, "/");

    await page.locator('[data-testid="cy-rail-areas"]').click();
    await expect(page).toHaveURL(/.*sidebar=areas.*/);
  });

  test("clicking the Areas button again removes sidebar from URL", async ({ page }) => {
    await visitAndWait(page, "/?sidebar=areas");

    await page.locator('[data-testid="cy-rail-areas"]').click();
    await expect(page).not.toHaveURL(/.*sidebar=areas.*/);
  });

  test("clicking the Tools button adds tools=menu to URL", async ({ page }) => {
    await visitAndWait(page, "/");

    await page.locator('[data-testid="cy-rail-tools"]').click();
    await expect(page).toHaveURL(/.*tools=menu.*/);
    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
  });

  test("clicking the Tools button again removes tools from URL", async ({ page }) => {
    await visitAndWait(page, "/?tools=menu");

    await page.locator('[data-testid="cy-rail-tools"]').click();
    await expect(page).not.toHaveURL(/.*tools.*/);
  });

  test("supports both sidebar params at the same time", async ({ page }) => {
    await visitAndWait(page, "/");

    await page.locator('[data-testid="cy-rail-areas"]').click();
    await page.locator('[data-testid="cy-rail-tools"]').click();

    await expect(page).toHaveURL(/.*sidebar=areas.*/);
    await expect(page).toHaveURL(/.*tools=menu.*/);
    await expect(page.locator('[data-testid="cy-area-search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-tools-menu"]')).toBeVisible();
  });
});
