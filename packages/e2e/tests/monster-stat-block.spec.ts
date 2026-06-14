import { test, expect } from "@playwright/test";

const visitAndWait = async (page: any, path: string) => {
  await page.addInitScript(() => {
    window.sessionStorage.removeItem("game-mastery-tools-sidebar-width");
  });
  await page.goto(path);
  await expect(page.locator('[data-testid="cy-app-shell"]')).toHaveAttribute("data-hydrated", "true");
};

test.describe("Monster stat block overlay", () => {
  test.describe("area monster list", () => {
    test("shows monster buttons for an area with monsters", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m1");

      await expect(page.getByText("Monsters")).toBeVisible();
      await expect(page.locator('[data-testid="cy-area-monster-sage"]')).toContainText("Sage");
      await expect(page.locator('[data-testid="cy-area-monster-imp"]')).toContainText("Imp");
    });

    test("does not show monster section for an area without monsters", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m2");

      await expect(page.getByText("Monsters")).not.toBeVisible();
    });

    test("opens the stat block dialog when clicking an area monster button", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m1");

      await page.locator('[data-testid="cy-area-monster-imp"]').click();

      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("h2")).toContainText("Imp");
      await expect(dialog.getByText("AC 13")).toBeVisible();
      await expect(dialog.getByText("HP 10 (3d4 + 3)")).toBeVisible();
    });
  });

  test.describe("stat block content", () => {
    test.beforeEach(async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m14");
      await page.locator('[data-testid="cy-area-monster-flyingSword"]').click();
      await expect(page.locator('[data-testid="cy-monster-stat-dialog"]')).toBeVisible();
    });

    test("displays the monster name and type", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog.locator("h2")).toContainText("Flying Sword");
      await expect(dialog.getByText("Small construct")).toBeVisible();
    });

    test("displays armor class, hit points, and speed", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog.getByText("AC 17 (natural armor)")).toBeVisible();
      await expect(dialog.getByText("HP 17 (5d6)")).toBeVisible();
      await expect(dialog.getByText("Speed")).toBeVisible();
    });

    test("displays all six ability scores", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog.getByText("Ability Scores")).toBeVisible();
      await expect(dialog.getByText("STR", { exact: true })).toBeVisible();
      await expect(dialog.getByText("DEX", { exact: true })).toBeVisible();
      await expect(dialog.getByText("CON", { exact: true })).toBeVisible();
      await expect(dialog.getByText("INT", { exact: true })).toBeVisible();
      await expect(dialog.getByText("WIS", { exact: true })).toBeVisible();
      await expect(dialog.getByText("CHA", { exact: true })).toBeVisible();
    });

    test("displays traits and actions", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog.getByText("Antimagic Susceptibility")).toBeVisible();
      await expect(dialog.getByText("Longsword")).toBeVisible();
    });

    test("displays challenge rating", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog.getByText("1/4 (50 XP)")).toBeVisible();
    });
  });

  test.describe("dialog dismissal", () => {
    test.beforeEach(async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m1");
      await page.locator('[data-testid="cy-area-monster-imp"]').click();
      await expect(page.locator('[data-testid="cy-monster-stat-dialog"]')).toBeVisible();
    });

    test("closes on close button click", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await dialog.locator('[aria-label="Close dialog"]').click();
      await expect(dialog).not.toBeVisible();
    });

    test("closes on Escape key", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    });

    test("closes on backdrop click", async ({ page }) => {
      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await page.locator(".MuiBackdrop-root").evaluate(el => (el as HTMLElement).click());
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe("inline monster references in MDX", () => {
    test("renders clickable monster references in area content", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m4");

      await expect(page.locator('[data-testid="cy-monster-reference-animatedBroom"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="cy-monster-reference-animatedBroom"]').first()).toContainText("animated broom");
    });

    test("opens the stat block when clicking an inline reference", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m4");

      await page.locator('[data-testid="cy-monster-reference-animatedBroom"]').first().click();

      const dialog = page.locator('[data-testid="cy-monster-stat-dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("h2")).toContainText("Animated Broom");
      await expect(dialog.getByText("AC 15 (natural armor)")).toBeVisible();
    });
  });

  test.describe("add to initiative", () => {
    test("adds the monster to the initiative tracker setup", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m14");

      await page.locator('[data-testid="cy-area-monster-flyingSword"]').click();
      await expect(page.locator('[data-testid="cy-monster-stat-dialog"]')).toBeVisible();
      await page.locator('[data-testid="cy-monster-add-initiative"]').click();

      await expect(page.locator('[data-testid="cy-monster-stat-dialog"]')).not.toBeVisible();
      await expect(page).toHaveURL(/.*tools=initiative.*/);
      await expect(page.locator('[data-testid="cy-initiative-setup-flying-sword"]')).toBeVisible();
      await expect(page.locator('[data-testid="cy-initiative-setup-flying-sword"]')).toContainText("Flying Sword");
      await expect(page.locator('[data-testid="cy-initiative-setup-hp-flying-sword"]')).toContainText("HP 17");
    });

    test("adds the monster even when the initiative tracker has no existing characters", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m8");

      await page.locator('[data-testid="cy-area-monster-mimicChair"]').click();
      await page.locator('[data-testid="cy-monster-add-initiative"]').click();

      await expect(page).toHaveURL(/.*tools=initiative.*/);
      await expect(page.locator('[data-testid="cy-initiative-setup-mimic-chair"]')).toContainText("Mimic Chair");
    });

    test("adds multiple monsters from the same area", async ({ page }) => {
      await visitAndWait(page, "/?sidebar=areas&area=m1");

      await page.locator('[data-testid="cy-area-monster-sage"]').click();
      await page.locator('[data-testid="cy-monster-add-initiative"]').click();

      await page.locator('[data-testid="cy-area-monster-imp"]').click();
      await page.locator('[data-testid="cy-monster-add-initiative"]').click();

      await expect(page.locator('[data-testid="cy-initiative-setup-sage"]')).toContainText("Sage");
      await expect(page.locator('[data-testid="cy-initiative-setup-imp"]')).toContainText("Imp");
    });

    test("shows queued alert when adding during active combat", async ({ page }) => {
      await visitAndWait(page, "/?tools=initiative&sidebar=areas&area=m14");

      // Set up combat first
      await page.locator('[data-testid="cy-initiative-name-input"]').fill("Gandalf");
      await page.locator('[data-testid="cy-initiative-bonus-input"]').fill("3");
      await page.locator('[data-testid="cy-initiative-add-character"]').click();
      await page.getByLabel("Gandalf roll").fill("15");
      await page.locator('[data-testid="cy-initiative-ready-button"]').click();
      await expect(page.locator('[data-testid="cy-initiative-round-status"]')).toContainText("Round 1");

      // Now add a monster from the stat block
      await page.locator('[data-testid="cy-area-monster-flyingSword"]').click();
      await page.locator('[data-testid="cy-monster-add-initiative"]').click();

      const alert = page.locator('[data-testid="cy-initiative-queued-setup-alert"]');
      await expect(alert).toBeVisible();
      await expect(alert).toContainText("1 monster was added to setup");
    });
  });
});
