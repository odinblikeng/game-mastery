/// <reference types="cypress" />

export { };

const visitAndWait = (path: string) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.sessionStorage.removeItem("game-mastery-tools-sidebar-width");
    },
  });
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

describe("Monster stat block overlay", () => {
  describe("area monster list", () => {
    it("shows monster buttons for an area with monsters", () => {
      visitAndWait("/?sidebar=areas&area=m1");

      cy.contains("Monsters").should("be.visible");
      cy.get('[data-testid="cy-area-monster-sage"]').should("contain", "Sage");
      cy.get('[data-testid="cy-area-monster-imp"]').should("contain", "Imp");
    });

    it("does not show monster section for an area without monsters", () => {
      visitAndWait("/?sidebar=areas&area=m2");

      cy.contains("Monsters").should("not.exist");
    });

    it("opens the stat block dialog when clicking an area monster button", () => {
      visitAndWait("/?sidebar=areas&area=m1");

      cy.get('[data-testid="cy-area-monster-imp"]').click();

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("be.visible");
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("Imp").should("be.visible");
        cy.contains("AC 13").should("be.visible");
        cy.contains("HP 10 (3d4 + 3)").should("be.visible");
      });
    });
  });

  describe("stat block content", () => {
    beforeEach(() => {
      visitAndWait("/?sidebar=areas&area=m14");
      cy.get('[data-testid="cy-area-monster-flyingSword"]').click();
      cy.get('[data-testid="cy-monster-stat-dialog"]').should("be.visible");
    });

    it("displays the monster name and type", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("Flying Sword").should("be.visible");
        cy.contains("Small construct").should("be.visible");
      });
    });

    it("displays armor class, hit points, and speed", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("AC 17 (natural armor)").should("be.visible");
        cy.contains("HP 17 (5d6)").should("be.visible");
        cy.contains("Speed").should("be.visible");
      });
    });

    it("displays all six ability scores", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("Ability Scores").should("be.visible");
        cy.contains("STR").should("be.visible");
        cy.contains("DEX").should("be.visible");
        cy.contains("CON").should("be.visible");
        cy.contains("INT").should("be.visible");
        cy.contains("WIS").should("be.visible");
        cy.contains("CHA").should("be.visible");
      });
    });

    it("displays traits and actions", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("Antimagic Susceptibility").scrollIntoView().should("be.visible");
        cy.contains("Longsword").scrollIntoView().should("be.visible");
      });
    });

    it("displays challenge rating", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("1/4 (50 XP)").scrollIntoView().should("be.visible");
      });
    });
  });

  describe("dialog dismissal", () => {
    beforeEach(() => {
      visitAndWait("/?sidebar=areas&area=m1");
      cy.get('[data-testid="cy-area-monster-imp"]').click();
      cy.get('[data-testid="cy-monster-stat-dialog"]').should("be.visible");
    });

    it("closes on close button click", () => {
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.get('[aria-label="Close dialog"]').click();
      });

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("not.exist");
    });

    it("closes on Escape key", () => {
      cy.get("body").type("{esc}");

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("not.exist");
    });

    it("closes on backdrop click", () => {
      cy.get(".MuiBackdrop-root").click({ force: true });

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("not.exist");
    });
  });

  describe("inline monster references in MDX", () => {
    it("renders clickable monster references in area content", () => {
      visitAndWait("/?sidebar=areas&area=m4");

      cy.get('[data-testid="cy-monster-reference-animatedBroom"]').should("be.visible");
      cy.get('[data-testid="cy-monster-reference-animatedBroom"]').should("contain", "animated broom");
    });

    it("opens the stat block when clicking an inline reference", () => {
      visitAndWait("/?sidebar=areas&area=m4");

      cy.get('[data-testid="cy-monster-reference-animatedBroom"]').first().click();

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("be.visible");
      cy.get('[data-testid="cy-monster-stat-dialog"]').within(() => {
        cy.contains("Animated Broom").should("be.visible");
        cy.contains("AC 15 (natural armor)").should("be.visible");
      });
    });
  });

  describe("add to initiative", () => {
    it("adds the monster to the initiative tracker setup", () => {
      visitAndWait("/?sidebar=areas&area=m14");

      cy.get('[data-testid="cy-area-monster-flyingSword"]').click();
      cy.get('[data-testid="cy-monster-stat-dialog"]').should("be.visible");
      cy.get('[data-testid="cy-monster-add-initiative"]').click();

      cy.get('[data-testid="cy-monster-stat-dialog"]').should("not.exist");
      cy.location("search").should("include", "tools=initiative");
      cy.get('[data-testid="cy-initiative-setup-flying-sword"]').should("be.visible");
      cy.get('[data-testid="cy-initiative-setup-flying-sword"]').should("contain", "Flying Sword");
      cy.get('[data-testid="cy-initiative-setup-hp-flying-sword"]').should("contain", "HP 17");
    });

    it("adds the monster even when the initiative tracker has no existing characters", () => {
      visitAndWait("/?sidebar=areas&area=m8");

      cy.get('[data-testid="cy-area-monster-mimicChair"]').click();
      cy.get('[data-testid="cy-monster-add-initiative"]').click();

      cy.location("search").should("include", "tools=initiative");
      cy.get('[data-testid="cy-initiative-setup-mimic-chair"]').should("contain", "Mimic Chair");
    });

    it("adds multiple monsters from the same area", () => {
      visitAndWait("/?sidebar=areas&area=m1");

      cy.get('[data-testid="cy-area-monster-sage"]').click();
      cy.get('[data-testid="cy-monster-add-initiative"]').click();

      cy.get('[data-testid="cy-area-monster-imp"]').click();
      cy.get('[data-testid="cy-monster-add-initiative"]').click();

      cy.get('[data-testid="cy-initiative-setup-sage"]').should("contain", "Sage");
      cy.get('[data-testid="cy-initiative-setup-imp"]').should("contain", "Imp");
    });

    it("shows queued alert when adding during active combat", () => {
      visitAndWait("/?tools=initiative&sidebar=areas&area=m14");

      // Set up combat first
      cy.get('[data-testid="cy-initiative-name-input"]').type("Gandalf");
      cy.get('[data-testid="cy-initiative-bonus-input"]').type("3");
      cy.get('[data-testid="cy-initiative-add-character"]').click();
      cy.get('[aria-label="Gandalf roll"]').type("15");
      cy.get('[data-testid="cy-initiative-ready-button"]').click();
      cy.get('[data-testid="cy-initiative-round-status"]').should("contain", "Round 1");

      // Now add a monster from the stat block
      cy.get('[data-testid="cy-area-monster-flyingSword"]').click();
      cy.get('[data-testid="cy-monster-add-initiative"]').click();

      cy.get('[data-testid="cy-initiative-queued-setup-alert"]').should("be.visible");
      cy.get('[data-testid="cy-initiative-queued-setup-alert"]').should(
        "contain",
        "1 monster was added to setup",
      );
    });
  });
});
