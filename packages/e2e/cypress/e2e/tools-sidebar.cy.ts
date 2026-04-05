/// <reference types="cypress" />

export {};

const visitAndWait = (path: string) => {
  cy.visit(path);
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
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
});