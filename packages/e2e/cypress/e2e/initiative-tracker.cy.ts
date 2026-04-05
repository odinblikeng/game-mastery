/// <reference types="cypress" />

export {};

const addCharacter = (name: string, bonus: number) => {
  cy.get('[data-testid="cy-initiative-name-input"]').type(name);
  cy.get('[data-testid="cy-initiative-bonus-input"]').type(String(bonus));
  cy.get('[data-testid="cy-initiative-add-character"]').click();
};

const addMonster = (slug: string) => {
  cy.get('[data-testid="cy-initiative-add-monster"]').click();
  cy.get(`[data-testid="cy-initiative-monster-option-${slug}"]`).click();
};

const visitAndWait = (path: string) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.sessionStorage.removeItem("game-mastery-tools-sidebar-width");
    },
  });
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

const getElementWidth = (selector: string) =>
  cy.get(selector).then(($element) => $element[0].getBoundingClientRect().width);

const dispatchPointerEvent = (
  eventName: "pointermove" | "pointerup",
  clientX: number,
) => {
  cy.window().then((win) => {
    win.dispatchEvent(
      new win.PointerEvent(eventName, {
        bubbles: true,
        button: 0,
        buttons: eventName === "pointerup" ? 0 : 1,
        clientX,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
  });
};

const resizeToolsSidebar = (deltaX: number) => {
  cy.get('[data-testid="cy-tools-sidebar-resize-handle"]').then(($handle) => {
    const handleBounds = $handle[0].getBoundingClientRect();
    const startX = handleBounds.left + handleBounds.width / 2;
    const endX = startX + deltaX;

    cy.wrap($handle).trigger("pointerdown", {
      button: 0,
      buttons: 1,
      clientX: startX,
      force: true,
      pointerId: 1,
      pointerType: "mouse",
    });
    cy.wait(50);
    dispatchPointerEvent("pointermove", endX);
    dispatchPointerEvent("pointerup", endX);
  });
};

describe("Initiative tracker", () => {
  beforeEach(() => {
    visitAndWait("/?tools=initiative");
  });

  it("adds characters and refocuses the name input", () => {
    addCharacter("Gandalf", 3);

    cy.get('[data-testid="cy-initiative-setup-gandalf"]').should("contain", "Gandalf");
    cy.focused().should("have.attr", "data-testid", "cy-initiative-name-input");
  });

  it("removes a character during setup", () => {
    addCharacter("Gandalf", 3);
    addCharacter("Legolas", 5);

    cy.get('[aria-label="Remove Legolas"]').click();

    cy.get('[data-testid="cy-initiative-setup-legolas"]').should("not.exist");
    cy.get('[data-testid="cy-initiative-setup-gandalf"]').should("exist");
  });

  it("resolves combat order from entered rolls", () => {
    addCharacter("Gandalf", 3);
    addCharacter("Legolas", 5);
    addCharacter("Gimli", 1);

    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[aria-label="Legolas roll"]').type("18");
    cy.get('[aria-label="Gimli roll"]').type("10");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[data-testid="cy-initiative-row-legolas"]').should("contain", "23");
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("contain", "18");
    cy.get('[data-testid="cy-initiative-row-gimli"]').should("contain", "11");
    cy.get('[data-testid="cy-initiative-row-legolas"]').should("have.attr", "data-active", "true");
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 1 / 3");
  });

  it("advances turns and wraps to the next round", () => {
    addCharacter("Gandalf", 3);
    addCharacter("Legolas", 5);
    addCharacter("Gimli", 1);

    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[aria-label="Legolas roll"]').type("18");
    cy.get('[aria-label="Gimli roll"]').type("10");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 2 / 3");
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("have.attr", "data-active", "true");

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 3 / 3");
    cy.get('[data-testid="cy-initiative-row-gimli"]').should("have.attr", "data-active", "true");

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 1 / 3");
    cy.get('[data-testid="cy-initiative-round-status"]').should("contain", "Round 2");
    cy.get('[data-testid="cy-initiative-row-legolas"]').should("have.attr", "data-active", "true");

    cy.get('[data-testid="cy-initiative-previous-turn"]').click();
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 3 / 3");
  });

  it("tracks death saves and stabilized state", () => {
    addCharacter("Gandalf", 3);
    addCharacter("Legolas", 5);
    addCharacter("Gimli", 1);

    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[aria-label="Legolas roll"]').type("18");
    cy.get('[aria-label="Gimli roll"]').type("10");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[aria-label="Mark Gimli as dying"]').click();
    cy.get('[data-testid="cy-initiative-row-gimli"]').should("have.attr", "data-state", "dying");
    cy.get('[data-testid="cy-initiative-saves-gimli"]').should("contain", "0 / 0");

    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Save").click();
    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Fail").click();
    cy.get('[data-testid="cy-initiative-saves-gimli"]').should("contain", "1 / 1");

    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Save").click();
    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Save").click();
    cy.get('[data-testid="cy-initiative-row-gimli"]').should("have.attr", "data-state", "stabilized");
    cy.contains('[data-testid="cy-initiative-row-gimli"]', "Stabilized").should("be.visible");
  });

  it("skips dead characters when advancing turns", () => {
    addCharacter("Gandalf", 3);
    addCharacter("Legolas", 5);
    addCharacter("Gimli", 1);

    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[aria-label="Legolas roll"]').type("18");
    cy.get('[aria-label="Gimli roll"]').type("10");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[aria-label="Mark Gimli as dying"]').click();
    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Fail").click();
    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Fail").click();
    cy.contains('[data-testid="cy-initiative-row-gimli"] button', "Fail").click();
    cy.get('[data-testid="cy-initiative-row-gimli"]').should("have.attr", "data-state", "dead");

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("have.attr", "data-active", "true");
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 2 / 3");

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-row-legolas"]').should("have.attr", "data-active", "true");
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 1 / 3");
    cy.get('[data-testid="cy-initiative-round-status"]').should("contain", "Round 2");
  });

  it("resets back to setup mode", () => {
    addCharacter("Gandalf", 3);
    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[data-testid="cy-initiative-reset-button"]').click();

    cy.get('[data-testid="cy-initiative-name-input"]').should("be.visible");
    cy.get('[data-testid="cy-initiative-ready-button"]').should("not.exist");
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("not.exist");
  });

  it("adds a monster from the picker with bonus and HP", () => {
    addMonster("swarm-of-animated-books");

    cy.get('[data-testid="cy-initiative-setup-swarm-of-animated-books"]').should(
      "contain",
      "Swarm of Animated Books",
    );
    cy.get('[aria-label="Swarm of Animated Books bonus"]').should("have.value", "1");
    cy.get('[data-testid="cy-initiative-setup-hp-swarm-of-animated-books"]').should(
      "contain",
      "HP 22",
    );
    cy.focused().should("have.attr", "data-testid", "cy-initiative-name-input");
  });

  it("auto-numbers duplicate monster entries", () => {
    addMonster("swarm-of-animated-books");
    addMonster("swarm-of-animated-books");

    cy.get('[data-testid="cy-initiative-setup-swarm-of-animated-books-1"]').should(
      "contain",
      "#1",
    );
    cy.get('[data-testid="cy-initiative-setup-swarm-of-animated-books-2"]').should(
      "contain",
      "#2",
    );
  });

  it("tracks monster HP separately from PC death saves", () => {
    addMonster("swarm-of-animated-books");
    addCharacter("Gandalf", 3);

    cy.get('[aria-label="Swarm of Animated Books roll"]').type("14");
    cy.get('[aria-label="Gandalf roll"]').type("15");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[data-testid="cy-initiative-hp-swarm-of-animated-books"]').should("have.value", "22");
    cy.get('[aria-label="Mark Swarm of Animated Books as dying"]').should("not.exist");
    cy.get('[aria-label="Mark Gandalf as dying"]').should("exist");
  });

  it("skips defeated monsters in turn navigation", () => {
    addMonster("swarm-of-animated-books");
    addCharacter("Gandalf", 3);

    cy.get('[aria-label="Swarm of Animated Books roll"]').type("14");
    cy.get('[aria-label="Gandalf roll"]').type("10");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    cy.get('[data-testid="cy-initiative-row-swarm-of-animated-books"]').should(
      "have.attr",
      "data-active",
      "true",
    );

    cy.get('[data-testid="cy-initiative-hp-swarm-of-animated-books"]').clear().type("0");
    cy.get('[data-testid="cy-initiative-row-swarm-of-animated-books"]').should(
      "have.attr",
      "data-state",
      "dead",
    );
    cy.get('[data-testid="cy-initiative-row-swarm-of-animated-books"]').should(
      "contain",
      "Defeated",
    );

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("have.attr", "data-active", "true");
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 2 / 2");

    cy.get('[data-testid="cy-initiative-next-turn"]').click();
    cy.get('[data-testid="cy-initiative-row-gandalf"]').should("have.attr", "data-active", "true");
    cy.get('[data-testid="cy-initiative-turn-status"]').should("contain", "Turn 2 / 2");
    cy.get('[data-testid="cy-initiative-round-status"]').should("contain", "Round 2");
  });

  it("reveals more of a long setup name when the tools sidebar is wider", () => {
    addCharacter("VeryLongCharacterName", 5);

    getElementWidth('[data-testid="cy-initiative-setup-name-verylongcharactername"]').then((initialWidth) => {
      resizeToolsSidebar(-112);

      cy.get('[data-testid="cy-initiative-setup-name-verylongcharactername"]').should(($element) => {
        expect($element[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
      });
    });
  });

  it("reveals more of a long combat name when the tools sidebar is wider", () => {
    addCharacter("VeryLongCharacterName", 5);

    cy.get('[aria-label="VeryLongCharacterName roll"]').type("17");
    cy.get('[data-testid="cy-initiative-ready-button"]').click();

    getElementWidth('[data-testid="cy-initiative-row-name-verylongcharactername"]').then((initialWidth) => {
      resizeToolsSidebar(-112);

      cy.get('[data-testid="cy-initiative-row-name-verylongcharactername"]').should(($element) => {
        expect($element[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
      });
    });
  });
});