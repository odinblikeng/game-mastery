/// <reference types="cypress" />

export {};

const visitAndWait = (path: string) => {
  cy.visit(path);
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

describe("Left rail navigation", () => {
  it("renders the rail shell on the dashboard", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-rail-logo"]').should("be.visible");
    cy.get('[data-testid="cy-rail-dashboard"]').should("be.visible");
    cy.get('[data-testid="cy-rail-areas"]').should("be.visible");
    cy.get('[data-testid="cy-rail-tools"]').should("be.visible");
    cy.get('[data-testid="cy-rail-theme-toggle"]').should("exist");
  });

  it("clears the query state when Dashboard is clicked", () => {
    visitAndWait("/?sidebar=areas&area=m1&tools=menu");

    cy.get('[data-testid="cy-rail-dashboard"]').click();

    cy.location("search").should("eq", "");
    cy.contains("Open the area compendium or session tools from the rail to get started.").should(
      "be.visible",
    );
  });

  it("clicking the Areas button adds sidebar to URL", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-rail-areas"]').click();
    cy.location("search").should("include", "sidebar=areas");
  });

  it("clicking the Areas button again removes sidebar from URL", () => {
    visitAndWait("/?sidebar=areas");

    cy.get('[data-testid="cy-rail-areas"]').click();
    cy.location("search").should("not.include", "sidebar=areas");
  });

  it("clicking the Tools button adds tools=menu to URL", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-rail-tools"]').click();
    cy.location("search").should("include", "tools=menu");
    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
  });

  it("clicking the Tools button again removes tools from URL", () => {
    visitAndWait("/?tools=menu");

    cy.get('[data-testid="cy-rail-tools"]').click();
    cy.location("search").should("not.include", "tools");
  });

  it("supports both sidebar params at the same time", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-rail-areas"]').click();
    cy.get('[data-testid="cy-rail-tools"]').click();

    cy.location("search").should("include", "sidebar=areas");
    cy.location("search").should("include", "tools=menu");
    cy.get('[data-testid="cy-area-search-input"]').should("be.visible");
    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
  });
});
