import { test, expect } from "@playwright/test";

const addCharacter = async (page: any, name: string, bonus: number) => {
  await page.locator('[data-testid="cy-initiative-name-input"]').fill(name);
  await page.locator('[data-testid="cy-initiative-bonus-input"]').fill(String(bonus));
  await page.locator('[data-testid="cy-initiative-add-character"]').click();
};

const addMonster = async (page: any, slug: string) => {
  await page.locator('[data-testid="cy-initiative-add-monster"]').click();
  await page.locator(`[data-testid="cy-initiative-monster-option-${slug}"]`).click();
};

const visitAndWait = async (page: any, path: string) => {
  await page.goto(path);
  await expect(page.locator('[data-testid="cy-app-shell"]')).toHaveAttribute("data-hydrated", "true");
};

test.describe("Initiative tracker", () => {
  test.beforeEach(async ({ page }) => {
    await visitAndWait(page, "/?tools=initiative");
  });

  test("adds characters and refocuses the name input", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);

    await expect(page.locator('[data-testid="cy-initiative-setup-gandalf"]')).toContainText("Gandalf");
    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeFocused();
  });

  test("removes a character during setup", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await addCharacter(page, "Legolas", 5);

    await page.getByLabel("Remove Legolas").click();

    await expect(page.locator('[data-testid="cy-initiative-setup-legolas"]')).not.toBeAttached();
    await expect(page.locator('[data-testid="cy-initiative-setup-gandalf"]')).toBeAttached();
  });

  test("resolves combat order from entered rolls", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await addCharacter(page, "Legolas", 5);
    await addCharacter(page, "Gimli", 1);

    await page.getByLabel("Gandalf roll").fill("15");
    await page.getByLabel("Legolas roll").fill("18");
    await page.getByLabel("Gimli roll").fill("10");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-row-legolas"]')).toContainText("23");
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).toContainText("18");
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]')).toContainText("11");
    await expect(page.locator('[data-testid="cy-initiative-row-legolas"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 1 / 3");
  });

  test("advances turns and wraps to the next round", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await addCharacter(page, "Legolas", 5);
    await addCharacter(page, "Gimli", 1);

    await page.getByLabel("Gandalf roll").fill("15");
    await page.getByLabel("Legolas roll").fill("18");
    await page.getByLabel("Gimli roll").fill("10");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 2 / 3");
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).toHaveAttribute("data-active", "true");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 3 / 3");
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]')).toHaveAttribute("data-active", "true");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 1 / 3");
    await expect(page.locator('[data-testid="cy-initiative-round-status"]')).toContainText("Round 2");
    await expect(page.locator('[data-testid="cy-initiative-row-legolas"]')).toHaveAttribute("data-active", "true");

    await page.locator('[data-testid="cy-initiative-previous-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 3 / 3");
  });

  test("tracks death saves and stabilized state", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await addCharacter(page, "Legolas", 5);
    await addCharacter(page, "Gimli", 1);

    await page.getByLabel("Gandalf roll").fill("15");
    await page.getByLabel("Legolas roll").fill("18");
    await page.getByLabel("Gimli roll").fill("10");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await page.getByLabel("Mark Gimli as dying").click();
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]')).toHaveAttribute("data-state", "dying");
    await expect(page.locator('[data-testid="cy-initiative-saves-gimli"]')).toContainText("0 / 0");

    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Save" }).click();
    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Fail" }).click();
    await expect(page.locator('[data-testid="cy-initiative-saves-gimli"]')).toContainText("1 / 1");

    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Save" }).click();
    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Save" }).click();
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]')).toHaveAttribute("data-state", "stabilized");
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]').getByText("Stabilized")).toBeVisible();
  });

  test("skips dead characters when advancing turns", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await addCharacter(page, "Legolas", 5);
    await addCharacter(page, "Gimli", 1);

    await page.getByLabel("Gandalf roll").fill("15");
    await page.getByLabel("Legolas roll").fill("18");
    await page.getByLabel("Gimli roll").fill("10");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await page.getByLabel("Mark Gimli as dying").click();
    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Fail" }).click();
    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Fail" }).click();
    await page.locator('[data-testid="cy-initiative-row-gimli"]').locator('button', { hasText: "Fail" }).click();
    await expect(page.locator('[data-testid="cy-initiative-row-gimli"]')).toHaveAttribute("data-state", "dead");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 2 / 3");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-row-legolas"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 1 / 3");
    await expect(page.locator('[data-testid="cy-initiative-round-status"]')).toContainText("Round 2");
  });

  test("resets back to setup mode", async ({ page }) => {
    await addCharacter(page, "Gandalf", 3);
    await page.getByLabel("Gandalf roll").fill("15");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await page.locator('[data-testid="cy-initiative-reset-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-initiative-ready-button"]')).not.toBeAttached();
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).not.toBeAttached();
  });

  test("reset clears monster entries — they do not re-appear", async ({ page }) => {
    await addMonster(page, "swarm-of-animated-books");

    await page.getByLabel("Swarm of Animated Books roll").fill("14");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await page.locator('[data-testid="cy-initiative-reset-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="cy-initiative-setup-swarm-of-animated-books"]')).not.toBeAttached();
    await expect(page.locator('[data-testid="cy-initiative-row-swarm-of-animated-books"]')).not.toBeAttached();
  });

  test("adds a monster from the picker with bonus and HP", async ({ page }) => {
    await addMonster(page, "swarm-of-animated-books");

    await expect(page.locator('[data-testid="cy-initiative-setup-swarm-of-animated-books"]')).toContainText("Swarm of Animated Books");
    await expect(page.getByLabel("Swarm of Animated Books bonus")).toHaveValue("1");
    await expect(page.locator('[data-testid="cy-initiative-setup-hp-swarm-of-animated-books"]')).toContainText("HP 22");
    await expect(page.locator('[data-testid="cy-initiative-name-input"]')).toBeFocused();
  });

  test("auto-numbers duplicate monster entries", async ({ page }) => {
    await addMonster(page, "swarm-of-animated-books");
    await addMonster(page, "swarm-of-animated-books");

    await expect(page.locator('[data-testid="cy-initiative-setup-swarm-of-animated-books-1"]')).toContainText("#1");
    await expect(page.locator('[data-testid="cy-initiative-setup-swarm-of-animated-books-2"]')).toContainText("#2");
  });

  test("tracks monster HP separately from PC death saves", async ({ page }) => {
    await addMonster(page, "swarm-of-animated-books");
    await addCharacter(page, "Gandalf", 3);

    await page.getByLabel("Swarm of Animated Books roll").fill("14");
    await page.getByLabel("Gandalf roll").fill("15");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-hp-chip-swarm-of-animated-books"]')).toContainText("HP 22/22");
    await expect(page.getByLabel("Mark Swarm of Animated Books as dying")).not.toBeAttached();
    await expect(page.getByLabel("Mark Gandalf as dying")).toBeAttached();
  });

  test("skips defeated monsters in turn navigation", async ({ page }) => {
    await addMonster(page, "swarm-of-animated-books");
    await addCharacter(page, "Gandalf", 3);

    await page.getByLabel("Swarm of Animated Books roll").fill("14");
    await page.getByLabel("Gandalf roll").fill("10");
    await page.locator('[data-testid="cy-initiative-ready-button"]').click();

    await expect(page.locator('[data-testid="cy-initiative-row-swarm-of-animated-books"]')).toHaveAttribute("data-active", "true");

    await page.locator('[data-testid="cy-initiative-hp-chip-swarm-of-animated-books"]').click();
    await page.locator('[data-testid="cy-initiative-hp-swarm-of-animated-books"]').fill("0");
    await page.locator('[data-testid="cy-initiative-hp-swarm-of-animated-books"]').press("Enter");
    await expect(page.locator('[data-testid="cy-initiative-row-swarm-of-animated-books"]')).toHaveAttribute("data-state", "dead");
    await expect(page.locator('[data-testid="cy-initiative-row-swarm-of-animated-books"]')).toContainText("Defeated");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 2 / 2");

    await page.locator('[data-testid="cy-initiative-next-turn"]').click();
    await expect(page.locator('[data-testid="cy-initiative-row-gandalf"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('[data-testid="cy-initiative-turn-status"]')).toContainText("Turn 2 / 2");
    await expect(page.locator('[data-testid="cy-initiative-round-status"]')).toContainText("Round 2");
  });
});
