/// <reference types="cypress" />

export {};

const TOOLS_SIDEBAR_STORAGE_KEY = "game-mastery-tools-sidebar-width";

const visitAndWait = (path: string, clearStoredWidth = true) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      if (clearStoredWidth) {
        win.sessionStorage.removeItem(TOOLS_SIDEBAR_STORAGE_KEY);
      }
    },
  });
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

const getPanelWidth = () =>
  cy.get('[data-testid="cy-tools-sidebar-panel"]').then(($panel) =>
    $panel[0].getBoundingClientRect().width,
  );

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

describe("Tools sidebar", () => {
  it("shows the tool menu", () => {
    visitAndWait("/?tools=menu");

    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
    cy.get('[data-testid="cy-tool-item-initiative"]').should("contain", "Initiative");
    cy.contains("1 Live").should("be.visible");
  });

  it("opens the initiative tool and returns to the menu", () => {
    visitAndWait("/?tools=menu");

    cy.get('[data-testid="cy-tool-item-initiative"]').click();
    cy.location("search").should("include", "tools=initiative");
    cy.get('[data-testid="cy-initiative-name-input"]').should("be.visible");

    cy.get('[data-testid="cy-tools-back-button"]').click();
    cy.location("search").should("include", "tools=menu");
    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
  });

  it("falls back to the menu for an unknown tool slug", () => {
    visitAndWait("/?tools=nonexistent");

    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
    cy.get('[data-testid="cy-tool-item-initiative"]').should("be.visible");
  });

  it("closes the tools sidebar", () => {
    visitAndWait("/?tools=menu");

    cy.get('[data-testid="cy-tools-sidebar-close"]').click();

    cy.location("search").should("eq", "");
    cy.get('[data-testid="cy-tools-menu"]').should("not.exist");
  });

  it("resizes the tools sidebar wider on desktop", () => {
    visitAndWait("/?tools=menu");

    getPanelWidth().then((initialWidth) => {
      resizeToolsSidebar(-96);

      cy.get('[data-testid="cy-tools-sidebar-panel"]').should(($panel) => {
        expect($panel[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
      });
    });
  });

  it("persists the resized tools sidebar width for the current session", () => {
    visitAndWait("/?tools=menu");

    getPanelWidth().then((initialWidth) => {
      resizeToolsSidebar(-112);

      cy.get('[data-testid="cy-tools-sidebar-panel"]').should(($panel) => {
        expect($panel[0].getBoundingClientRect().width).to.be.greaterThan(initialWidth);
      });

      getPanelWidth().then((resizedWidth) => {
        cy.window().then((win) => {
          expect(win.sessionStorage.getItem(TOOLS_SIDEBAR_STORAGE_KEY)).to.eq(
            String(Math.round(resizedWidth)),
          );
        });

        cy.reload();
        cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");

        getPanelWidth().should((reloadedWidth) => {
          expect(reloadedWidth).to.be.closeTo(resizedWidth, 1);
        });
      });
    });
  });
});