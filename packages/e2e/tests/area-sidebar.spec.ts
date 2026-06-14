import { test, expect } from "@playwright/test";

const visitAndWait = async (page: any, path: string) => {
  await page.goto(path);
  await expect(page.locator('[data-testid="cy-app-shell"]')).toHaveAttribute("data-hydrated", "true");
};

test.describe("Area sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await visitAndWait(page, "/?sidebar=areas");
  });

  test("shows all available areas", async ({ page }) => {
    await expect(page.locator('[data-testid^="cy-area-item-"]')).toHaveCount(19);
    await expect(page.locator('[data-testid="cy-area-item-m1"]')).toContainText("Foyer and Hallway");
    await expect(page.locator('[data-testid="cy-area-item-m2"]')).toContainText("Patio");
    await expect(page.locator('[data-testid="cy-area-item-m3"]')).toContainText("Library");
  });

  test("filters by code and title", async ({ page }) => {
    const searchInput = page.locator('[data-testid="cy-area-search-input"]');
    await searchInput.fill("M1");
    await expect(page.locator('[data-testid="cy-area-item-m1"]')).toBeAttached();
    await expect(page.locator('[data-testid="cy-area-item-m10"]')).toBeAttached();
    await expect(page.locator('[data-testid="cy-area-item-m2"]')).not.toBeAttached();

    await searchInput.clear();
    await searchInput.fill("Library");
    await expect(page.locator('[data-testid="cy-area-item-m3"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-area-item-m13"]')).toBeAttached();
  });

  test("shows an empty-state message when the search misses", async ({ page }) => {
    await page.locator('[data-testid="cy-area-search-input"]').fill("zzz");
    await expect(page.getByText("No areas match your search.")).toBeVisible();
  });

  test("loads the selected area content into the main panel", async ({ page }) => {
    await page.locator('[data-testid="cy-area-item-m1"]').click();

    await expect(page).toHaveURL(/.*area=m1.*/);
    await expect(page.locator('[data-testid="cy-area-item-m1"]')).toHaveClass(/Mui-selected/);
    await expect(page.locator("h1")).toContainText("Foyer and Hallway");
    await expect(page.getByRole("main").getByText("A dramatic arrival space with long sightlines")).toBeVisible();
  });

  test("collapses the Areas sidebar and updates the URL when the collapse button is clicked", async ({ page }) => {
    await expect(page.locator('[data-testid="cy-area-search-input"]')).toBeVisible();
    await page.locator('[data-testid="cy-area-collapse-button"]').click();

    await expect(page.locator('[data-testid="cy-area-search-input"]')).not.toBeVisible();
    await expect(page).not.toHaveURL(/.*sidebar=areas.*/);
  });
});
