/// <reference types="cypress" />

export {};

const visitAndWait = (path: string) => {
  cy.visit(path);
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

describe("Header navigation", () => {
  it("renders the header shell on the dashboard", () => {
    visitAndWait("/");

    cy.contains("Campaign Command Screen").should("be.visible");
    cy.get('[data-testid="cy-header-theme-toggle"]').should("be.visible");
    cy.get('[data-testid="cy-header-dashboard-button"]').should("be.visible");
    cy.get('[data-testid="cy-header-area-button"]').should("be.visible");
    cy.get('[data-testid="cy-header-tools-button"]').should("be.visible");
  });

  it("clears the query state when Dashboard is clicked", () => {
    visitAndWait("/?sidebar=areas&area=m1&tools=menu");

    cy.get('[data-testid="cy-header-dashboard-button"]').click();

    cy.location("search").should("eq", "");
    cy.contains("Open the area compendium or session tools from the header to get started.").should(
      "be.visible",
    );
  });

  it("toggles the area sidebar from the header", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-header-area-button"]').click();
    cy.location("search").should("include", "sidebar=areas");
    cy.get('[data-testid="cy-area-search-input"]').should("be.visible");

    cy.get('[data-testid="cy-header-area-button"]').click();
    cy.location("search").should("eq", "");
    cy.get('[data-testid="cy-area-search-input"]').should("not.exist");
  });

  it("toggles the tools sidebar from the header", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-header-tools-button"]').click();
    cy.location("search").should("include", "tools=menu");
    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");

    cy.get('[data-testid="cy-header-tools-button"]').click();
    cy.location("search").should("eq", "");
    cy.get('[data-testid="cy-tools-menu"]').should("not.exist");
  });

  it("supports both sidebars being open at the same time", () => {
    visitAndWait("/");

    cy.get('[data-testid="cy-header-area-button"]').click();
    cy.location("search").should("include", "sidebar=areas");
    cy.get('[data-testid="cy-header-tools-button"]').click();

    cy.location("search").should("include", "sidebar=areas");
    cy.location("search").should("include", "tools=menu");
    cy.get('[data-testid="cy-area-search-input"]').should("be.visible");
    cy.get('[data-testid="cy-tools-menu"]').should("be.visible");
  });
});